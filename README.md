# Berkeley and Cristian algorithms
## By Muhammad Muneeb (/vacuitydev)
### [Site: www.vacuity.online](www.vacuity.online)
### [LinkedIn: /in/muhammad-muneeb-39b238218/](https://www.linkedin.com/in/muhammad-muneeb-39b238218/)

![timesync title](./attachments/timesync_title.jpg)
## What is this?
Implementations and testing suite of the time synchronization algorithms Berkeley and Cristian
## How do I run these?
### Cristian
Cristian algorithm is implemented simply in `express` and ol' faithful `html`.
#### Server
From root:
```bash
cd ./Cristian/Server
npm install
node server
```
#### Client
Simply run `Cristian/Client/index.html' in your favorite browser. For multiple instances, just open more tabs. Easy.

### Berkeley
Berkeley is implemented in `express` and `electron`.
#### Server
You only need one server
```bash
cd ./Berkeley
npm install
node server
```
#### Client
You can run multiple clients through electron. No problem.
```bash
cd ./Berkeley
npm install
npx electron .
```

## Preview
### Cristian
Client start:
![Alt text](./attachments/timesync/image.png)
Client with time error:
![Alt text](./attachments/timesync/image-1.png)
Server start:
![Alt text](./attachments/timesync/image-2.png)
After client requests adjustment, client error is significantly reduced, down to processing delay:
![Alt text](./attachments/timesync/image-3.png)
And that's it for Cristian.
### Berkeley
Server starts:
![Alt text](./attachments/timesync/image-4.png)
Clients start:
![Alt text](./attachments/timesync/image-5.png)
One client has the wrong time:
![berkeley client mismatch](./attachments/timesync/image-6.png)
Clients after rebalance (client times are comparable):
![clients after rebalance](./attachments/timesync/image-7.png)
Server handling it all during rebalance:
![server text](./attachments/timesync/image-8.png)
![server text 2](./attachments/timesync/image-9.png)
## Why did I make this?
We had lab work for the subject of Distributed Computing. At the time, for the semester project of the same course, I was exploring desktop app tech that would be fast and convenient. So of course I was looking at Electron.

This was an opportunity to stress test Electron and I took it.
