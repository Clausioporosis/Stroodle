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
5. [Configuration](#configuration)
    - [Environment Variables](#environment-variables)
    - [Configuration Files](#configuration-files)
6. [API Documentation](#api-documentation)
    - [Authentication](#authentication)
        - [Keycloak Integration](#keycloak-integration)
    - [Endpoints Overview](#endpoints-overview)
        - [User Endpoints](#user-endpoints)
        - [Event Endpoints](#event-endpoints)
        - [Scheduling Endpoints](#scheduling-endpoints)
    - [Request and Response Examples](#request-and-response-examples)
7. [Database Schema](#database-schema)
    - [ER Diagram](#er-diagram)
    - [Table Descriptions](#table-descriptions)
8. [Docker Setup](#docker-setup)
    - [Docker Compose](#docker-compose)
    - [Building and Running with Docker](#building-and-running-with-docker)
9. [Testing](#testing)
    - [Frontend Testing](#frontend-testing)
        - [Manual Testing](#manual-testing)
    - [Backend Testing](#backend-testing)
        - [Unit Tests](#unit-tests)
        - [Integration Tests](#integration-tests)
10. [CI/CD Pipeline](#cicd-pipeline)
    - [Overview](#overview)
    - [Configuration](#configuration-1)
11. [Deployment](#deployment)
    - [Deployment Process](#deployment-process)
    - [Server Configuration](#server-configuration)
    - [Domain Configuration](#domain-configuration)
    - [Hosting Provider](#hosting-provider)
12. [Contributing](#contributing)
    - [Contribution Guidelines](#contribution-guidelines)
    - [Code of Conduct](#code-of-conduct)
13. [FAQ](#faq)
    - [Common Issues](#common-issues)
    - [Troubleshooting](#troubleshooting)
14. [License](#license)
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
- **MongoDB:** A NoSQL database known for its flexibility and scalability. It stores data in flexible, JSON-like documents, making it easy to iterate and update your schema. Chosen for its ability to handle large volumes of unstructured data efficiently.

### Database

#### MongoDB
- **MongoDB:** A NoSQL database known for its flexibility and scalability. It stores data in flexible, JSON-like documents, making it easy to iterate and update your schema.
