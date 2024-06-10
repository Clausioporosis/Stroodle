# Stroodle
#### The Scheduling Web App

## Table of Contents
1. [Project Overview](#project-overview)
    - [Introduction](#introduction)
    - [Key Features](#key-features)
    - [Interface and Usage](#interface-and-usage)
       - [Login](#login)
       - [Dashboard](#dashboard)
       - [Availability](#availability)
       - [Poll Creation](#poll-creation)
       - [Participant and Organizer Poll View](#participant-and-organizer-poll-view)
2. [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Running the Application](#running-the-application)
3. [Configuration](#configuration)
    - [Environment Variables](#environment-variables)
    - [Configuration Files](#configuration-files)
4. [API Documentation](#api-documentation)
    - [Authentication](#authentication)
    - [Endpoints Overview](#endpoints-overview)
        - [User Endpoints](#user-endpoints)
        - [Event Endpoints](#event-endpoints)
        - [Scheduling Endpoints](#scheduling-endpoints)
    - [Request and Response Examples](#request-and-response-examples)
5. [Database Schema](#database-schema)
    - [ER Diagram](#er-diagram)
    - [Table Descriptions](#table-descriptions)
6. [Docker Setup](#docker-setup)
    - [Docker Compose](#docker-compose)
    - [Building and Running with Docker](#building-and-running-with-docker)
7. [Testing](#testing)
    - [Running Unit Tests](#running-unit-tests)
    - [Running Integration Tests](#running-integration-tests)
8. [CI/CD Pipeline](#cicd-pipeline)
    - [Overview](#overview)
    - [Configuration](#configuration-1)
9. [License](#license)
    - [License Information](#license-information)

## Project Overview

### Introduction

**Stroodle** is a web application for scheduling appointments. It allows users to create polls for potential meeting times and invite multiple participants to vote on the proposed times. This helps determine the best time for a meeting when most participants are available.

### Key Features

- **Create Polls:** Create polls for possible meeting times and invite multiple users to participate.
- **Set Availability:** Participants can specify their availability in a weekly view from Monday to Sunday, selecting time slots when they are available.
- **Calendar Integration:** Connect your calendar via an ICS link to see your existing appointments when selecting meeting times, ensuring you choose a time that works for you.

### Interface and Usage

#### Login

#### Dashboard

#### Availability

#### Poll Creation

#### Participant and Organizer Poll View
