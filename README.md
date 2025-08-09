#  Blog App 2.0 — Bilingual Blog Application with API Integration

A simple, modern blog application built with Node.js, Express.js, and EJS templating, allowing users to create, edit, and delete posts in both English and French. Includes an inspirational quotes feature fetched from an external API.

#  Features

- Create, edit, and delete blog posts (in-memory storage)
- Bilingual UI: English  and French  (dynamic interface & translations)
- Inspirational quote: Fetch a random quote via the [ZenQuotes API](https://zenquotes.io/)
- Modern, responsive design (HTML, CSS)
- Deployed on two web servers with load balancing using HAProxy



#  Local Setup

# Prerequisites

- [Node.js](https://nodejs.org/) & [npm](https://www.npmjs.com/)
- [Git](https://git-scm.com/)

# Clone the Repository

```bash
git clone https://github.com/Josephadelin22/blog-app-2.0.git
cd blog-app-2.0

```

# Dependencies

```bash
npm install

```
# To run the application

```bash
node app.js
```


##  Docker Setup

###  Dockerfile
The application is fully containerized using Docker.  
Here’s how to build and run the container:

####  Build the image
```bash
docker build -t josephadelin/blog-app:v1 .
```

#### ▶ Run the container
```bash
docker run -d --name blog-app -p 8080:8080 josephadelin/blog-app:v1
```

App will now be reachable at http://localhost:3000

---

## Push to Docker Hub
```bash
docker login
docker tag josephadelin/blog-app:v1 josephadelin/blog-app:latest
docker push josephadelin/blog-app:v1
```

---

##  Deployment on Web Servers

We used the Web Infra Lab setup with three containers:
- web-01 (Docker host)
- web-02 (Docker host)
- lb-01 (HAProxy load balancer)

###  Steps on web-01 & web-02
```bash
docker pull josephadelin/blog-app:v1
docker run -d --name blog-app --restart unless-stopped -p 3000:3000 josephadelin/blog-app:v1
```

 The app is now running on:
- http://web-01:3000
- http://web-02:3000

---

## ⚖️ HAProxy Load Balancer (lb-01)

### Configuration
Add the following to `/etc/haproxy/haproxy.cfg`:
```haproxy
frontend http-in
    bind *:80
    default_backend webapps

backend webapps
    balance roundrobin
    server web01 172.20.0.11:3000 check
    server web02 172.20.0.12:3000 check
```

Reload HAProxy:
```bash
docker exec -it lb-01 sh -c 'haproxy -sf $(pidof haproxy) -f /etc/haproxy/haproxy.cfg'
```

---

  Testing
From your local machine:
```bash
curl http://localhost:3000
```
➡Requests alternate between web-01 and web-02 (round-robin load balancing).

---

##  APIs Used
- [ZenQuotes API](https://zenquotes.io/) – for inspirational quotes  
- [Google Books API](https://developers.google.com/books) – for book search feature



  Challenges Faced
when you try to connect docker in your web servers dockers refuses to connect with git pull.



 Demo Video
 A 2-minute demo video** has been recorded showing:
- Local setup and usage
- Docker container running the app
- Explanation of deployment steps & HAProxy configuration



 Author
Joseph Boussamba Quenum  
Passionate about Web Development & DevOps




