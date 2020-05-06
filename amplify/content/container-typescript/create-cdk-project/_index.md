+++
title = "New TypeScript CDK Project"
weight = 10
pre= "<b>2.1. </b>"
+++


* 🎯 We will use `cdk init` to create a new AWS CDK Python project.

* 🎯 We will also use the CDK Toolkit to synthesize an AWS
CloudFormation template for the starter app and how to deploy your app into your AWS Account.

> **Step 1.** Creating a CDK application

```
mkdir cdk-eks
cd cdk-eks

cdk init --language typescript
```

> **Step 2.** Compile TypeScript sources to JavaScript

This will start the TypeScript compiler `tsc` in “watch” mode, which will monitor your project directory and will automatically compile any changes to your `.ts` files to `.js`.

```bash
# npm run build

npm run watch
```

> **Step 3.** Explore Your Project Directory 

```
## RHEL/CentOS and Fedora Linux
sudo yum install tree -y
## Debian/Ubuntu, Mint Linux
# sudo apt-get install tree -y
## MacOS
# brew install tree
tree
```

{{%expand "✍️ Project Structure" %}}
* __`lib/cdk-eks-stack.ts`__ is where your CDK application's main stack is defined.
  This is the file we'll be spending most of our time in.
* `bin/cdk-eks.ts` is the entrypoint of the CDK application. It will load
  the stack defined in `lib/cdk-eks-stack.ts`.
* `package.json` is your npm module manifest. It includes information like the
  name of your app, version, dependencies and build scripts like "watch" and
  "build" (`package-lock.json` is maintained by npm)
* `cdk.json` tells the toolkit how to run your app. In our case it will be
  `"npx ts-node bin/cdk-eks.ts"`
* `tsconfig.json` your project's [typescript
  configuration](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)
* `.gitignore` and `.npmignore` tell git and npm which files to include/exclude
  from source control and when publishing this module to the package manager.
* `node_modules` is maintained by npm and includes all your project's
  dependencies.
{{% /expand%}}

> **Step 4.** Synthesize a template from your app

```
cdk synth
```

> **Step 5.** Bootstrapping an environment then Deploy

```
cdk bootstrap

cdk deploy cdk-eks
```

{{%expand "✍️ Bootstrapping an Environment" %}}
The first time you deploy an AWS CDK app into an Environment (AWS Account/Region), you’ll need to install a “Bootstrap Stack”.

This stack includes resources that are needed for the toolkit’s operation. For example, the stack includes an S3 bucket that is used to store templates and assets during the deployment process.
{{% /expand%}}

{{% notice note %}} 
You're READY ✅ for some actual CODING! 👌
{{% /notice %}}