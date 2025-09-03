#!/bin/bash

# Clear the stack:
aws cloudformation delete-stack --stack-name neoapi-dev --region us-east-2 && aws cloudformation wait stack-delete-complete --stack-name neoapi-dev --region us-east-2

aws cloudformation delete-stack --stack-name neoapi-prod --region us-east-2 && aws cloudformation wait stack-delete-complete --stack-name neoapi-prod --region us-east-2

# set env vars
AWS_REGION="us-east-2"  # Change to your region
AWS_ACCOUNT_ID="417278330808"  # Change to your account ID
REPOSITORY_NAME="neoapi-prod"
IMAGE_TAG="latest"
STACK_NAME="neoapi-prod"
ENVIRONMENT="prod"
IMAGE_URI="417278330808.dkr.ecr.us-east-2.amazonaws.com/neoapi-prod:latest"
VPC_ID="vpc-0d10dcdc60306b07e"
PRIVATE_SUBNETS="subnet-0e66614ca7e9e7247,subnet-013f8ff069404c987"
NODE_ENV=development
APIPORT=3001
RDS_HOSTNAME=neotomaprivate.cxkwxkjpj8zi.us-east-2.rds.amazonaws.com
RDS_USERNAME=neotomaAdmin
RDS_DATABASE=neotomatank
RDS_PASSWORD=ndbgeopoliticalunits
RDS_PORT=5432
LOCALLIMIT=false
SSL_CERT=true
NATIVELANDKEY=1lMifvl80k2C6uQFEdEru
PORT=3001
HOSTED_ZONE_ID="Z06678132YXCZ3LP39MIP"
DOMAIN_NAME="api.neotomadb.org"

docker build -f Dockerfile -t neoapi-prod:latest .
aws ecr get-login-password --region ${AWS_REGION} | \
  docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com

# Tag image for ECR
docker tag ${REPOSITORY_NAME}:${IMAGE_TAG} \
${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${REPOSITORY_NAME}:${IMAGE_TAG}

# Push to ECR
echo "Pushing image to ECR..."
docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${REPOSITORY_NAME}:${IMAGE_TAG}

echo "Ensuring App Runner service-linked role exists"
aws iam create-service-linked-role --aws-service-name apprunner.amazonaws.com 2>/dev/null || echo "Service-linked role already exists"

aws cloudformation deploy \
          --template-file infrastructure/cloudformation-template.yaml \
          --stack-name ${STACK_NAME} \
          --parameter-overrides \
            Environment=${ENVIRONMENT} \
            ImageUri=${IMAGE_URI} \
            RDSHostname=${RDS_HOSTNAME} \
            RDSDatabase=${RDS_DATABASE} \
            RDSUsername=${RDS_USERNAME} \
            RDSPassword=${RDS_PASSWORD} \
            VPCId=${VPC_ID} \
            PrivateSubnets=${PRIVATE_SUBNETS} \
            Port=3001 \
            HostedZoneId=${HOSTED_ZONE_ID} \
            DomainName=${DOMAIN_NAME} \
          --capabilities CAPABILITY_NAMED_IAM \
          --region ${AWS_REGION}