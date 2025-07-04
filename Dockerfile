# Step 1: Build the app
FROM public.ecr.aws/lambda/nodejs:22.2025.07.02.12-x86_64 AS builder

WORKDIR /usr/app

# Copy package.json and package-lock.json to the container
COPY . .

# Install dependencies
RUN npm install
RUN npm install typescript -D

RUN npm run build

FROM public.ecr.aws/lambda/nodejs:22.2025.07.02.12-x86_64

WORKDIR ${LAMBDA_TASK_ROOT}

COPY --from=builder /usr/app/ ./

CMD ["build/index.handler"]