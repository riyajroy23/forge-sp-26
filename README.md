# forge-sp-26
# ReCo-op - Forge Software Spring '26

## Project Overview

**Reco-Op** is a full-stack website designed to help students prepare for co-op opportunities through collaborative group-based preparation. Instead of navigating the co-op search and interview process alone, users can form co-op prep groups, share resources, and conduct mock interviews together. Users also have the opportunity to engage with current Northeastern co-ops and alumni who can mentor them about specific companies and roles through website-hosted coffee chats and workshops.

Some of the features for Reco-Op users will be:

* Discover and connect with students and employees based on career interests, past co-ops, or companies of interest
* Create and join co-op prep groups to prepare for interviews together
* Share and collaborate on preparation materials such as resumes, job descriptions, and interview notes
* Gamify preparation through group working sessions, points, and leaderboards

## Tech Stack

### Frontend

* **React** (web)
* **TypeScript**
* **Tailwind CSS** for styling
* **shadcn/ui** component library

### Backend

* API server (details may evolve as the project progresses)
* Database integration (e.g., Supabase)

---

## Repository Structure

```
forge-sp-26/
├─ frontend/        # React frontend application
├─ backend/         # Backend API and database logic
├─ shared/          # Shared types or schemas (if applicable)
├─ README.md
└─ .gitignore
```

## Local Development Setup

### Prerequisites

Make sure you have the following installed:

* **Node.js** (LTS version recommended)
* **npm** or **yarn**
* **Git**

---

### 1. Clone the repository

```bash
git clone https://github.com/riyajroy23/forge-sp-26.git
cd forge-sp-26
```
---

### 2. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

The frontend should now be running locally (typically at `http://localhost:5173`).


### 3. Environment setup
Create a local environment file:

[To be completed]

```bash
cp .env.example .env
```

Update any required environment variables in `.env` as needed.


### 3. Backend setup

[To be completed]


## Contribution Guide

* Create a feature branch for your work
* Keep all commits scoped and well-described
* Run the app locally and test ALL changes before opening a pull request (PR)
* In your PR, describe the changes you made and how you tested them + proof of the tests passing (if relevant)
