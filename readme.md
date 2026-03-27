MASTER PROMPT
Build a LeetCode-Style Platform for IBM i Developers
Project Name

Code400Lab — The Modern Practice Platform for IBM i Developers

1. System Vision

Build a world-class coding practice platform similar to LeetCode, but specialized for the IBM i ecosystem.

The platform should help developers improve their skills in:

RPGLE (Fully Free Format)
CLLE (Control Language)

The goal is to modernize the IBM i learning ecosystem by providing:

structured coding challenges
AI-generated practice problems
real IBM i business scenarios
performance analytics
interactive coding workflows

The platform should feel like modern SaaS developer software, not legacy enterprise tooling.

The design should follow Linear-inspired product aesthetics:

minimal interface
extremely fast interactions
keyboard-first workflows
dark-mode developer UI
high information density without clutter

Linear-style design emphasizes clean sequential layouts, strong typography, minimal color usage, and productivity-focused UI.

2. Core Product Goals
Primary Users

IBM i developers including:

AS/400 beginners
RPGLE developers
CLLE system programmers
IBM i consultants
enterprise maintainers of legacy systems
Platform Goals

The platform should enable users to:

Practice IBM i coding problems
Solve real enterprise scenarios
Track coding progress
Compete with other developers
Learn modern RPGLE syntax
Improve performance and debugging skills
3. Key Platform Features
1️⃣ Coding Practice Environment

LeetCode-style coding interface:

Left panel:

Problem description
Input/output specification
examples

Right panel:

Code editor
language selector
test case runner

Languages supported:

RPGLE
CLLE
2️⃣ AI Problem Generation

Use Gemini Flash to dynamically generate new problems.

Problem categories include:

file processing
DB2 queries
data validation
job logs
spool file analysis
CL automation
journal analysis
system administration
batch processing

Generated problems must mimic real IBM i production tasks.

3️⃣ Problem Difficulty System

Three difficulty levels:

Easy
Medium
Hard

Examples:

Easy

convert char to numeric
calculate totals
parse input file

Medium

file aggregation
data validation
record grouping

Hard

multi-file processing
job log parsing
journal analysis
4️⃣ Learning Path

Structured skill progression:

Beginner Path

RPGLE syntax
variables
loops
file reading

Intermediate Path

DB2 interaction
service programs
error handling

Advanced Path

performance optimization
APIs
journaling
system automation
5️⃣ Leaderboard

Gamified ranking system.

Points earned for:

solving problems
solving quickly
solving hard problems
daily streak

Ranking levels:

Beginner
Developer
Senior Developer
Architect
IBM i Master

4. Technical Architecture
Core Framework

Next.js (App Router)

React 19

Database

SQLite + Prisma

Use Prisma singleton pattern.

Example schema:

model Problem {
  id           String @id
  title        String
  difficulty   String
  language     String
  category     String
  description  String
  inputFormat  String
  outputFormat String
  sampleInput  String
  sampleOutput String
  starterCode  String
}
API Structure
/api/problems
/api/problems/[id]
/api/problems/generate
/api/submissions
/api/leaderboard
Client Performance

Use:

local caching
optimistic UI
server streaming
partial hydration

Navigation must feel instant.

5. Code Execution Strategy

IBM i servers are expensive.

So simulate execution using:

Multi-layer validation system

Layer 1
Dynamic Input Variation

Layer 2
Execution token

Layer 3
Output verification

Layer 4
AI code analysis

This prevents cheating without requiring a real IBM i backend.

6. IBM i Domain Rules
RPGLE Requirements

All generated code must use:

**FREE

Use modern syntax:

dcl-s
dcl-pr
dcl-pi

Use built-in functions:

%int
%dec
%trim
%subst

Avoid fixed format RPG.

CLLE Requirements

Programs must contain:

PGM
ENDPGM

Error handling required:

MONMSG

Examples should reflect real automation tasks.

7. UI/UX Design System

Inspired by the Linear SaaS interface.

Principles:

Minimal
Fast
Keyboard-driven
Developer-focused

Visual Style

Dark theme

Background

#0A0A0A

Primary accent

#5E6AD2

Success color

#00E676

Error color

#FF4D4F
Typography

Headings

Space Grotesk

Body

Inter

Code

JetBrains Mono
UI Components

Cards

Glassmorphism with subtle blur

Buttons

Hover transform

Navigation

Floating top bar

Editor

VSCode-style layout

Layout Structure

Three-panel layout:

Sidebar
Problem viewer
Code editor
8. Advanced Features (Future)
AI Code Review

AI analyzes submitted RPGLE code and suggests improvements.

Interview Mode

Simulated IBM i coding interviews.

Company Challenges

Enterprises can create private problem sets.

Real IBM i Runner

Optional integration with:

IBM Power Systems

for real program execution.

9. Project Structure
app
 ├ api
 │  ├ problems
 │  ├ submissions
 │  └ leaderboard

lib
 ├ db.js
 ├ ai.js
 └ cache.js

components
 ├ Editor
 ├ ProblemPanel
 ├ Leaderboard
 └ Dashboard

prisma
 └ schema.prisma
10. Scalability

The system must support:

10,000+ problems
AI-generated challenges
caching for millisecond load time
modular micro-APIs
Final Goal

Create the world’s best practice platform for IBM i developers, bringing modern developer-experience design to a legacy ecosystem.