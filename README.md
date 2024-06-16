This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

# TODO: instructions on setting up the environment for this web app

run `openssl rand -base64 32` to generate a string for NEXTAUTH_SECRET

### Notes:

Runs on port 3000

Follow https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-amazon/ to install MongoDB on Amazon Linux 2023, after runnning `sudo yum install -y mongodb-org`, run `sudo yum remove mongodb-mongosh`, `sudo yum install mongodb-mongosh-shared-openssl3`, `sudo yum install mongodb-mongosh` after that.

To meet MongoDB's requirements, run `sudo vim /etc/sysctl.conf`, add the following `vm.max_map_count=128000`, save and exit the text editor, apply the changes: `sudo sysctl -p`.

### .env.local Settings

Set `MONGODB_URL` to `mongodb://127.0.0.1:27017/HelpQueueDB`
