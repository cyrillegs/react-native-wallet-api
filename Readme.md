
# 🚀 React Native Wallet API - Backend Setup on Contabo VPS

This document explains how to deploy and run the **React Native Wallet API backend** on a Contabo VPS using Node.js, PM2, Neon DB, and Upstash Redis. It also covers troubleshooting steps and environment configuration.

---

## **1️⃣ Clone the repository**

```bash
git clone https://github.com/cyrillegs/react-native-wallet-api.git
cd react-native-wallet-api/backend/react-native-wallet-api
````

---

## **2️⃣ Install dependencies**

Make sure you are in the backend folder where `package.json` is located:

```bash
npm install
```

This will install all required Node.js packages, including `express`, `dotenv`, and `@neondatabase/serverless`.

---

## **3️⃣ Setup `.env` file**

Create a `.env` file in the backend folder:

```env
PORT=5005
DATABASE_URL=postgresql://<user>:<password>@<host>/<db>?sslmode=require&channel_binding=require
UPSTASH_REDIS_REST_URL=https://<your-upstash-url>
UPSTASH_REDIS_REST_TOKEN=<your-upstash-token>
```

> Make sure you replace the placeholders with your actual Neon DB and Upstash Redis credentials.

---

## **4️⃣ Test the backend locally**

Start the server directly with Node (optional, for testing):

```bash
node src/server.js
```

Check that the server starts correctly:

```
my port: 5005
Server is up and running on PORT: 5005
```

Test the health endpoint:

```bash
curl http://localhost:5005/api/health
```

Expected response:

```json
{"status":"ok"}
```

---

## **5️⃣ Run backend with PM2**

PM2 allows the backend to **run in the background** and **restart automatically on crashes or reboot**.

```bash
pm2 start src/server.js --name react-native-wallet-api
pm2 logs react-native-wallet-api --lines 50
```

* Check that `Server is up and running on PORT: 5005` appears in logs.
* Ensure there are **no `ERR_MODULE_NOT_FOUND` errors** (if so, run `npm install` again in the correct folder).

---

## **6️⃣ Set PM2 to restart on server reboot**

1. Save the current process list:

```bash
pm2 save
```

2. Configure PM2 startup script (for systemd):

```bash
sudo pm2 startup systemd
```

* PM2 will output a command, for example:

```bash
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u cyril --hp /home/cyril
```

* Copy and run the command to register PM2 as a startup service.

3. After this, PM2 will automatically restart the backend after VPS reboot.

---

## **7️⃣ Troubleshooting**

* **`ERR_MODULE_NOT_FOUND: express`**
  → Ensure you are in the correct folder (`backend/react-native-wallet-api`) and run `npm install`.

* **`Network request failed` in React Native app**
  → Ensure the backend is running and reachable on the correct port (`5005`). Test with:

```bash
curl http://<VPS-IP>:5005/api/health
```

* **Database connection errors**
  → Ensure `.env` has `DATABASE_URL` set correctly and the Neon DB compute branch is active.

* **Redis errors**
  → Ensure Upstash Redis URL and token are correct. Redis must exist; if deleted, restore it.

---

## **8️⃣ Notes**

* React Native frontend must use the **correct backend URL and port** (e.g., `http://<VPS-IP>:5005/api`).
* PM2 ensures the backend runs continuously and **auto-restarts on crashes or server reboot**.
* Make sure `.env` contains all necessary credentials for Neon DB and Upstash Redis.

---

## **References**

* [PM2 Documentation](https://pm2.keymetrics.io/)
* [Neon Database Docs](https://neon.tech/docs)
* [Upstash Redis Docs](https://docs.upstash.com/)
* [Clerk Auth Docs](https://clerk.com/docs/deployments/overview)

```
