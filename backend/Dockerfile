#Official node image.
FROM node:18

#Setting working directory.
WORKDIR /app/backend    

# Copy package.json
COPY package*json ./

#Install dependencies
# RUN npm install

# Copy rest
COPY . .

WORKDIR /app/backend

# Install serverless framework(globally)
RUN npm install serverless

# Start command.
CMD [ "serverless", "deploy" ]