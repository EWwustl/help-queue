This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app). It runs on port 3000 by default.

# Getting Started

## 1) Set up Amazon Linux 2023

1. Register an AWS account if you do not have one yet
2. Log into your AWS account
3. Search for 'EC2' and click on the EC2 Service
4. Launch a new instance:

    1. Click on the 'Launch instance' button
    2. Name and tags: Give your instance a descriptive name
    3. Application and OS Images (Amazon Machine Image): Select 'Amazon Linux 2023 AMI'
    4. Instance type: Choose an instance type ('t2.micro' for the free tier should be sufficient)
    5. Key pair (login): Create a new key pair or select an existing one. This key pair is used to SSH into your instance. Download the key pair file (.pem file) and keep it secure
    6. Network settings: Create a new security group or select an existing one. Ensure the security group is configured to allow HTTP (port 80) and SSH (port 22) access
    7. Add a rule to allow traffic on port 3000, which is used by this app:
        - Type: Custom TCP
        - Protocol: TCP
        - Port range: 3000
        - Source: Custom (set to 0.0.0.0/0 to allow all IPs)

## 2) Configure EC2 Instance

1. Follow the instructions at https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/connect-linux-inst-ssh.html to connect to your instance via SSH (**All future steps, unless specified otherwise, will be done in the instance you connected to**)
2. Run `sudo yum update -y` to update the instance
3. Follow the instructions at https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-up-node-on-ec2-instance.html to install [Node.js](https://nodejs.org/en/about) and [NPM](https://docs.npmjs.com/about-npm) on your instance. In short, run the following lines:

```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install --lts
```

4. Run `sudo yum install git -y` to ensure [Git](https://git-scm.com/book/en/v2) is installed
5. Run `sudo npm install pm2@latest -g` to install [PM2](https://pm2.keymetrics.io/docs/usage/quick-start/)
6. Verify successful installation by running `node -v`, `npm -v`, `git -v`, and `pm2 -v`. You should see their versions

## 3) Set up MongoDB

1. Follow the instructions at https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-amazon/ to install MongoDB on your instance
    - After runnning `sudo yum install -y mongodb-org` from the tutorial, run:

```
  sudo yum remove mongodb-mongosh
  sudo yum install mongodb-mongosh-shared-openssl3
  sudo yum install mongodb-mongosh
```

2. To meet MongoDB's requirements:
    1. Run `sudo vim /etc/sysctl.conf`
    2. Add the following `vm.max_map_count=128000`
    3. Save and exit the text editor
    4. Apply the changes: `sudo sysctl -p`

## 4) Set up GitHub OAuth Apps

1. Go to GitHub and navigate to Settings
2. Go to "Developer settings"
3. Select "OAuth Apps"
4. Click on "New OAuth App"
5. Fill in the details (**make sure to replace the example link with link to your own ec2 instance**):

    - Application name: `help-queue` or a specific name you desire
    - Homepage URL: `http://ec2-xxx-xxx-xxx-xx.compute-1.amazonaws.com:3000/`
    - Application description: `*optional*`
    - Authorization callback URL: `http://ec2-xxx-xxx-xxx-xx.compute-1.amazonaws.com:3000/api/auth/callback/github`

6. Click "Register application"
7. Retrieve Your Client ID and Secret:
    - After registering the app, you will see the Client ID
    - Click on "Generate a new client secret" to get the Client Secret. Save this secret somewhere secure

## 5) Clone this repo

1.  Clone this repo directly or fork your own copy
2.  Run `git clone <web-url-provided-by-github-for-cloning>`
3.  You may be asked to provide your GitHub credentials during the clone process:

    -   Username: `<your-github-username>`
    -   Password: `<your-github-password>` or `<your-personal-access-token>`
    -   If you have two-factor authentication enabled, you’ll need to use a personal access token instead of your password. You can create a personal access token on GitHub by following these steps:

        1. Go to GitHub and navigate to Settings
        2. Go to "Developer settings"
        3. Select "Personal access tokens"
        4. Click Generate new token and follow the prompts
        5. Make sure to save this token somewhere secure for future use

    -   Use the token in place of your password when prompted by Git

4.  Run `cd help-queue/` to navigate into the cloned directory

## 6) Set up `.env.local`

1.  Copy the `.env.template` file and rename the copy as `.env.local`
2.  Edit the copy:

    -   Set `NEXTAUTH_URL` to this Next.js app's URL, such as `http://ec2-xxx-xxx-xxx-xx.compute-1.amazonaws.com:3000/` (by default, Next.js app runs on port 3000)
    -   Set `NEXTAUTH_SECRET` to a string generated by running `openssl rand -base64 32`
    -   Set `GITHUB_ID` to your GitHub OAuth App's Client ID
    -   Set `GITHUB_SECRET` to your GitHub OAuth App's Client Secret
    -   Set `MONGODB_URL` to `mongodb://127.0.0.1:27017/HelpQueueDB` (default)
    -   Set `ADMIN_EMAILS` to emails of users who should have admin access, separated by commas only, with no spaces

## 7) Build & Deploy the App

1. Run `npm install` to automatically install the dependencies for this app
2. Run `npm run build` to build this app; this may take a while and display some negligible warnings
3. Run `pm2 start npm --name "help-queue" -- start` to start this app via PM2
4. Run `pm2 save` to save the PM2 process list
5. Run `pm2 startup` to set PM2 to start on boot
6. Follow the instructions that appear to enable PM2 to start on system startup

## 8) Use the App

1. Open a browser on your computer
2. Go to `http://ec2-xxx-xxx-xxx-xx.compute-1.amazonaws.com:3000/` (**make sure to replace the example link with link to your own ec2 instance**)
3. This Help Queue app should be available to use
4. Click on the 'Sign in with GitHub' button in the upper right corner to sign in
5. After successfully logging in:
    1. The courses dashboard should be displayed in the middle of the page
    2. Your name and email will be displayed in the upper right corner, replacing the sign-in button
    3. The email is a clickable button; click on it to open a panel for changing your name or logging out

# File Structure

-   `/app/layout.js`: The root layout of the app
-   `/app/page.js`: The main page the user sees
-   `/app/(components)/`: All the components that would be conditionally rendered on the main page based on user interactions
-   `/app/(lib)/mongoose.js`: File to connect the app to MongoDB
-   `/app/(models)/`: Files for declaring the data structures to use in MongoDB
-   `/app/api/auth/[...nextauth]/route.js`: File to handle API calls for user authentication (loggin in via GitHub)
-   `/app/api/courses/` & `/app/api/users/`: Files to handle API calls for interacting with MongoDB
