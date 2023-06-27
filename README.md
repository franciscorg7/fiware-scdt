<!-- PROJECT LOGO -->
<br />
<div align="center">
  <img src="resources/images/smart-city.png" alt="smart-city-logo" width="100" height="100">
  <h1 align="center">Smart-City Digital Twin for Autonomous Vehicles Support</h1>
</div>

<!-- ABOUT THE PROJECT -->

## About The Project

Urban or city digital twins are a virtual representation of a city's physical assets, using data, data analytics and machine learning to build simulation models that can be updated and changed (real-time) as their physical equivalents change. This project is core for Theia's autonomous vehicles project for leveraging all the research being accomplished and its focus relies on using the FIWARE ecosystem and extending it to support the digital twin.

### Built With

![FIWARE](https://img.shields.io/badge/-FIWARE-9cf?style=for-the-badge&logo=fiware&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Grafana](https://img.shields.io/badge/grafana-%23F46800.svg?style=for-the-badge&logo=grafana&logoColor=white)

<!-- GETTING STARTED -->

## Getting Started

This project is built upon several base components that rely on the FIWARE ecosystem. The installation process can be complex and time-consuming, and it's not always easy to reproduce the same environment across different machines.

For this matter and to ensure consistency across different environments, I decided to use Docker to encapsulate and distribute all the services into interdependent containers.

### Prerequisites

1. Docker 🐳

### Installation

_Make sure you run the following commands in the root folder._

1. Create and start containers for all the services needed:

```sh
docker-compose up -d
```

### Usage

Inside the root folder,

1. To get the MySQL image instance running, run the bash script like:

```
./run-mysql-img.sh
```

2. If you want to reset the long term persistency, run:

```
./reset-long-term-persistency.sh
```

## Contact

If you have any doubt or any constructive comment to make, please feel free to reach me.

Francisco Gonçalves - franciscorg.dev@gmail.com
