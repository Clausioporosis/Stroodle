# Stroodle
#### The Scheduling Web App

## Table of Contents
1. [Project Overview](#project-overview)
    - [Introduction](#introduction)
    - [Key Features](#key-features)
    - [Purpose and Use Cases](#purpose-and-use-cases)
2. [Interface and Usage](#interface-and-usage)
    - [Login](#login)
    - [Dashboard](#dashboard)
    - [Availability](#availability)
    - [Poll Creation](#poll-creation)
    - [Participant View](#participant-view)
    - [Organizer View](#organizer-view)
3. [Technology Stack](#technology-stack)
    - [Backend](#backend)
        - [Spring Boot](#spring-boot)
        - [Dependencies](#dependencies)
    - [Frontend](#frontend)
        - [React TypeScript](#react-typescript)
        - [Dependencies](#dependencies-1)
    - [Database](#database)
4. [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Running the Application](#running-the-application)
5. [API Documentation](#api-documentation)
    - [API Overview](#api-overview)
        - [User API](#user-api)
        - [Poll API](#poll-api)
        - [Availability API](#availability-api)
        - [ICS API](#ics-api)
        - [Auth API](#auth-api)
        - [Outlook API](#outlook-api)
        - [Email API](#email-api)
    - [API Testing](#api-testing)
        - [Authentication](#authentication)
        - [Swagger](#swagger)
        - [Insomnia](#insomnia)
6. [Database Schema](#database-schema)
    - [ER Diagram](#er-diagram)
    - [Table Descriptions](#table-descriptions)
7. [Docker Setup](#docker-setup)
    - [Docker Compose](#docker-compose)
    - [Building and Running with Docker](#building-and-running-with-docker)
8. [Testing](#testing)
    - [Frontend Testing](#frontend-testing)
        - [Manual Testing](#manual-testing)
    - [Backend Testing](#backend-testing)
        - [Unit Tests](#unit-tests)
        - [Integration Tests](#integration-tests)
9. [CI/CD Pipeline](#cicd-pipeline)
    - [Overview](#overview)
    - [Configuration](#configuration-1)
10. [Deployment](#deployment)
    - [Deployment Process](#deployment-process)
    - [Server Configuration](#server-configuration)
    - [Domain Configuration](#domain-configuration)
    - [Hosting Provider](#hosting-provider)
11. [Contributing](#contributing)
    - [Contribution Guidelines](#contribution-guidelines)
    - [Code of Conduct](#code-of-conduct)
12. [FAQ](#faq)
    - [Common Issues](#common-issues)
    - [Troubleshooting](#troubleshooting)
13. [License](#license)
    - [License Information](#license-information)


## Project Overview

### Introduction

**Stroodle** is a web application for scheduling appointments. It allows users to create polls for potential meeting times and invite multiple participants to vote on the proposed times. This helps determine the best time for a meeting when most participants are available.

### Key Features

- **Create Polls:** Create polls for possible meeting times and invite multiple users to participate.
- **Set Availability:** Participants can specify their availability in a weekly view from Monday to Sunday, selecting time slots when they are available.
- **Calendar Integration:** Connect your calendar via an ICS link to see your existing appointments when selecting meeting times, ensuring you choose a time that works for you.

### Purpose and Use Cases

The primary purpose of Stroodle is to simplify the process of scheduling meetings and events with multiple participants. It is especially useful in following scenarios:

- **Team Meetings:** Scheduling regular team meetings where availability of all members varies.
- **Client Appointments:** Coordinating meeting times with clients who have busy schedules.
- **Event Planning:** Organizing events such as workshops, seminars, or social gatherings where participants need to agree on a suitable date and time.
- **Personal Events:** Planning personal events like family gatherings, outings with friends, or community events where participants need to agree on a common time.

By providing a clear view of everyone's availability and integrating with personal calendars, Stroodle ensures that scheduling conflicts are minimized and meetings are set at the most convenient times for all participants.

## Interface and Usage

### Login

![Login](assets/stroodle_login.jpeg)

When you open Stroodle, you'll see the login screen where you can either log in with your existing account or sign up for a new account.

### Dashboard

![Dashboard](assets/stroodle_dashboard.jpeg)

The dashboard provides an overview of your organized polls on the left and the polls you are invited to on the right. Each poll card displays the most important information, including the title and description for your polls, and the organizer, location, and meeting duration for the polls you are invited to. You can edit, share, and delete your polls using the corresponding buttons on each poll you have created.

### Availability

![Availability](assets/stroodle_availability.jpeg)

When clicking on Availability in the navigation bar, the availability view will open where you can edit it to mark time slots from Monday to Sunday. Blue slots indicate already set availability, while green slots indicate pending changes that need to be saved. Use the "Save" button to confirm your new availability time slots.

### Poll Creation

![Poll Creation](assets/stroodle_poll_edit.jpeg)

When creating a poll, you can add a title, description, and location. Participants can be added via the search bar. You can also integrate your ICS calendar link using the button above the week view. There is an option to select multiple preset meeting durations (15, **25**, 30, 45 minutes, all day an custom) to simplify scheduling.

### Participant View

![Participant View](assets/stroodle_view_participant.jpeg)

In the participant view, you can see the poll information and the list of participants along with their voting status. Participants can select multiple days when they are available and save their selections.

### Organizer View

![Organizer View](assets/stroodle_view_organizer.jpeg)

The organizer view provides an overview of all participants, their voting status, and the poll information. Organizers have the option to select one day and finalize the booking for all participants.

![Booked Meeting View](assets/stroodle_view_booked_meeting.jpeg)

Once a meeting is booked, both the organizer and participants can view the poll information. However, the organizer has the option to edit the final day of the meeting or reopen the whole poll, which is indicated by the edit button in the top left corner.

## Technology Stack

### Backend

#### Spring Boot
- **Spring Boot:** A framework that simplifies the development of stand-alone, production-grade Spring-based applications. Chosen for its ease of configuration and rapid development capabilities, making it ideal for building robust backend services quickly.

#### Dependencies
- **Lombok:** A Java library that helps to reduce boilerplate code by providing annotations for common tasks like getters, setters, and constructors.
- **SpringDoc OpenAPI:** A library that automates the generation of API documentation using OpenAPI 3.0 specifications.
- **Spring Security:** Provides comprehensive security services for J2EE-based enterprise software applications.
- **OAuth2 Resource Server:** Secures the backend using OAuth2 and JWT tokens.
- **MongoDB Starter:** Integration with MongoDB for data storage.
- **Validation Starter:** Used for validating data in your Spring Boot application.
- **DevTools:** Provides features for improving the development experience such as automatic restarts.
- **Keycloak:** An open-source identity and access management solution for modern applications and services.
- **MSAL4J:** A Java library for authenticating users with Microsoft identity platforms.
- **iCal4j:** A library for parsing and creating iCalendar data.

### Frontend

#### React TypeScript
- **React:** A JavaScript library for building user interfaces, chosen for its component-based architecture which promotes reusability and modularity.
- **TypeScript:** Adds static typing to JavaScript, helping to catch errors early during development and improving code quality and maintainability.

#### Dependencies
- **FullCalendar:** A JavaScript calendar library for creating interactive and customizable calendar views.
- **@react-keycloak/web:** Integrates Keycloak with React for authentication.
- **React Bootstrap:** Provides Bootstrap components for React.
- **React Router DOM:** Enables dynamic routing in a web application.
- **Tippy.js:** A lightweight and extensible tooltip library.
- **uuid:** A library for generating unique identifiers.

### Database

#### MongoDB
- **MongoDB**: A NoSQL database known for its flexibility and scalability. It stores data in flexible, JSON-like documents, making it easy to iterate and update your schema. MongoDB was chosen for this project to explore its capabilities and to gain hands-on experience with its features.


## Getting Started

### Prerequisites

Before you can set up and run Stroodle, make sure you have the following software installed on your system:

- **Docker**: Ensure you have Docker installed. You can download it from [here](https://www.docker.com/get-started).
- **Docker Compose**: Docker Compose is typically included with Docker Desktop installations. Ensure it is installed and available on your command line.
- **Keycloak**: Stroodle relies on Keycloak for authentication. You can use the existing Keycloak instance at `login.stroodle.online` (open for sign-ups) or set up your own Keycloak instance.
- **MongoDB**: If you plan to run the backend locally without Docker, you will need MongoDB installed and running.

### Installation

Follow these steps to set up the Stroodle application using Docker:

1. **Clone the Repository**:
   ```sh
   git clone https://github.com/yourusername/stroodle.git
   cd stroodle
   git checkout develop
   ```

### Running the Application

#### Running with Docker

1. **Build and Start the Docker Containers**:
   - Ensure you are in the root directory of the project:
     ```sh
     cd stroodle
     ```
   - Run Docker Compose to build and start all services:
     ```sh
     docker-compose up --build
     ```
   - This command will build the Docker images and start the containers for the backend, frontend, and database services.

2. **Access the Application**:
   - Once the containers are up and running, you can access the application by navigating to `http://localhost:3000` in your web browser.

#### Keycloak Configuration

- **Using Existing Keycloak Instance**: The default configuration uses the Keycloak instance at `login.stroodle.online`. You can sign up and use this instance for development and testing.
- **Setting Up Your Own Keycloak Instance**:
  1. Set up a local Keycloak instance. You can follow the Keycloak [getting started guide](https://www.keycloak.org/getting-started) for instructions.
  2. Ensure your `application.yml` is configured to connect to your keycloak instance:
     ```yaml
     keycloak:
       auth-server-url: https://your-keycloak-domain
       realm: your-realm
       resource: your-client-id

     spring:
       security:
         oauth2:
           resourceserver:
             jwt:
               issuer-uri: https://your-keycloak-domain/realms/your-realm
               jwk-set-uri: https://your-keycloak-domain/realms/your-realm/protocol/openid-connect/certs

     auth:
       converter:
         resource-id: your-realm-name
         principle-attribute: preferred_username
     ``` 

### Optional: Running the Application Locally

If you need to run the Application locally for any reason (e.g., for debugging purposes), follow these steps. Note that this setup might require additional configuration and is provided for advanced users:

1. **Install Java Development Kit (JDK) 17**:
   - Ensure that you have JDK 17 installed. You can download it from [here](https://www.oracle.com/java/technologies/javase-jdk17-downloads.html).

2. **Install Maven**:
   - Ensure you have Apache Maven installed (or use the included Maven Wrapper). You can download it from [here](https://maven.apache.org/download.cgi).

3. **Install and Start MongoDB**:
   - Ensure you have MongoDB installed. You can download it from [here](https://www.mongodb.com/try/download/community).
   - Start MongoDB on your local machine. The default configuration usually runs MongoDB on `mongodb://localhost:27017`.

4. **Start the Backend**:
   - Navigate to the backend directory:
     ```sh
     cd backend
     ```
   - Ensure your `application.yml` is configured to connect to your local MongoDB instance:
     ```yaml
     spring:
       data:
         mongodb:
           uri: mongodb://localhost:27017/stroodle
     ```
   - Run the backend application using Maven:
     ```sh
     mvn spring-boot:run
     ```
   - Note: This might require additional configuration and dependencies to be set up correctly.

5. **Start the Frontend**:
   - Open a new terminal and navigate to the frontend directory:
     ```sh
     cd frontend
     ```
   - Install the frontend dependencies:
     ```sh
     npm install
     ```
   - Start the frontend application using npm:
     ```sh
     npm start
     ```

6. **Access the Application**:
   - Once both the backend and frontend are running, you can access the application by navigating to `http://localhost:3000` in your web browser.

## API Documentation

### API Overview

#### User API

**Endpoint: `/api/users`**
- **Method:** `GET`
- **Description:** Get all users.
- **Response Body:** will be added later

**Endpoint: `/api/users/{id}`**
- **Method:** `GET`
- **Description:** Get user by ID.
- **Response Body:** will be added later

**Endpoint: `/api/users/search?query={query}`**
- **Method:** `GET`
- **Description:** Search users by keyword.
- **Response Body:** will be added later

#### Poll API

**Endpoint: `/api/polls`**
- **Method:** `GET`
- **Description:** Retrieve a list of polls.
- **Response Body:** will be added later

**Endpoint: `/api/polls`**
- **Method:** `POST`
- **Description:** Create a new poll.
- **Request Body:** will be added later

**Endpoint: `/api/polls/{id}`**
- **Method:** `PUT`
- **Description:** Update a poll.
- **Request Body:** will be added later

**Endpoint: `/api/polls/{id}`**
- **Method:** `DELETE`
- **Description:** Delete a poll.

**Endpoint: `/api/polls/search/{id}`**
- **Method:** `GET`
- **Description:** Search polls by ID.
- **Response Body:** will be added later

**Endpoint: `/api/polls/search/title`**
- **Method:** `GET`
- **Description:** Search polls by title.
- **Response Body:** will be added later

**Endpoint: `/api/polls/me`**
- **Method:** `GET`
- **Description:** Retrieve polls created by the authenticated user.
- **Response Body:** will be added later

**Endpoint: `/api/polls/me/invitations`**
- **Method:** `GET`
- **Description:** Retrieve poll invitations for the authenticated user.
- **Response Body:** will be added later

#### Availability API

**Endpoint: `/api/users/{userId}/availability`**
- **Method:** `GET`
- **Description:** Retrieve availability for a specific user.
- **Response Body:** will be added later

**Endpoint: `/api/users/{userId}/availability`**
- **Method:** `POST`
- **Description:** Set availability for a specific user.
- **Request Body:** will be added later

#### ICS API

**Endpoint: `/api/ics/save`**
- **Method:** `POST`
- **Description:** Save ICS calendar information.
- **Request Body:** will be added later

**Endpoint: `/api/ics/status`**
- **Method:** `GET`
- **Description:** Get the status of ICS calendar synchronization.
- **Response Body:** will be added later

**Endpoint: `/api/ics/events`**
- **Method:** `GET`
- **Description:** Retrieve events from the ICS calendar.
- **Response Body:** will be added later

#### Auth API

**Endpoint: `/api/authenticate/azure`**
- **Method:** `GET`
- **Description:** 
- **Response Body:** will be added later

- **Endpoint: `api/authenticate/azure/callback?code={access-code}`**
- **Method:** `GET`
- **Description:** 
- **Response Body:** will be added later

#### Outlook API

**Endpoint: `/api/outlook/profile`**
- **Method:** `GET`
- **Description:** Retrieve profile data from authenticated Microsoft user.
- **Response Body:** will be added later

- **Endpoint: `api/outlook/events`**
- **Method:** `GET`
- **Description:** Retrieve event data from authenticated Microsoft user. Currently not working [LINK FAQ!]
- **Response Body:** will be added later

#### Email API

- **Endpoint: `api/email/send`**
- **Method:** `GET`
- **Description:** [MISSING DESCRIPTION!]
- **Response Body:** will be added later

### API Testing

#### Authentication

- You can obtain the JWT token using Insomnia with the following details:
   - **POST** request to: `https://your-keycloak-domain/realms/your-realm/protocol/openid-connect/token`
   - **Form (URL Encoded):**
     - `grant_type`    `password`
     - `client_id`     `your-client-id`
     - `username`      `your-username`
     - `password`      `your-password`
       
From here, you can continue using Insomnia to test the API endpoints by including an `Authorization` header with the value `Bearer {access_token}`. Alternatively, follow the instructions below to use Swagger:

#### Swagger

Stroodle's API documentation and testing interface is provided via Swagger. You can access the Swagger UI at `/swagger-ui.html` once the application is running. After obtaining the JWT token, click the "Authorize" button at the top right corner and paste the token to be able to use the API.

