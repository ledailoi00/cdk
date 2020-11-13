import core = require("@aws-cdk/core");
import ecs = require("@aws-cdk/aws-ecs");
import ec2 = require("@aws-cdk/aws-ec2");
import ecsPatterns = require("@aws-cdk/aws-ecs-patterns");
import elbv2 = require("@aws-cdk/aws-elasticloadbalancingv2");
import iam = require("@aws-cdk/aws-iam");
import { Table } from "@aws-cdk/aws-dynamodb";

export interface EcsServiceStackProps {
  readonly ecsCluster: ecs.ICluster;
  readonly serviceName: string;
  readonly taskmemoryLimitMiB: number;
  readonly taskCPU: number;
  readonly containerPort: number;
  readonly springCodeLocation: string;
  readonly publicLoadBalancer: boolean;
  readonly desiredCount: number;
  readonly table: Table;
  readonly tags?: {
    [key: string]: string;
  };
}

/**
 * Creating the ECS service
 */
export class EcsServiceStack extends core.Stack {
  public readonly service: ecsPatterns.NetworkLoadBalancedFargateService;
  public readonly loadBalancerOutput: core.CfnOutput;
  constructor(parent: core.App, name: string, props: EcsServiceStackProps) {
    super(parent, name, {
      tags: props.tags,
    });

    //creating task role with necessary pemissions
    const taskRole = new iam.Role(this, 'MyRole', {
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
    });

    taskRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        resources: [props.table.tableArn],
        actions: [            
          'dynamodb:GetRecords',
          'dynamodb:GetItem',
          'dynamodb:PutItem',
          'dynamodb:Query',
          'dynamodb:Scan',
          'dynamodb:UpdateItem',
          'dynamodb:DeleteItem',
          'dynamodb:BatchGetItem',
          'dynamodb:BatchWriteItem',
          'dynamodb:DescribeTable'
        ]
      })
    );

    /* creating NLB/ALB fronted ECS service */
    this.service = new ecsPatterns.NetworkLoadBalancedFargateService(
      this,
      "Service",
      {
        serviceName: props.serviceName,
        desiredCount: props.desiredCount,
        cluster: props.ecsCluster,
        memoryLimitMiB: props.taskmemoryLimitMiB,
        cpu: props.taskCPU,
        publicLoadBalancer: props.publicLoadBalancer,
        taskImageOptions: {
          containerPort: props.containerPort,
          image: ecs.ContainerImage.fromAsset(props.springCodeLocation),
          taskRole: taskRole
        },
      }
    );

    /* opening ports */
    const allPorts = new ec2.Port({
      protocol: ec2.Protocol.TCP,
      fromPort: 0,
      toPort: 65535,
      stringRepresentation: "All",
    });

    this.service.service.connections.allowFromAnyIpv4(allPorts);

    /* configuring heath checks */
    this.service.targetGroup.configureHealthCheck({
      port: "traffic-port",
      protocol: elbv2.Protocol.TCP,
    });

    /* setting deregistration_delay.timeout_seconds */
    this.service.targetGroup.setAttribute(
      "deregistration_delay.timeout_seconds",
      "60"
    );

    this.loadBalancerOutput = new core.CfnOutput(this, "LoadBalanceDNS", {
      value: this.service.loadBalancer.loadBalancerDnsName,
    });
  }
}