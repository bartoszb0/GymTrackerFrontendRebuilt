# GymTracker - Tool for tracking gym progress

This app is designed primarily for mobile use, allowing users to manage and track their fitness progress directly during workouts. Users can create workouts, including exercises, sets, reps, and weights used. The app provides a “Workout Mode,” allowing users to move through each exercise set by set and update their current weights. Additionally, the app includes a daily protein tracking feature, enabling users to record their intake and monitor progress toward personalized protein goals. 

[Backend Repository](https://github.com/bartoszb0/GymTrackerBackend)

> Author: Bartosz Bednarczyk  
>  Email: bartoszb2020@gmail.com

## Video
https://github.com/user-attachments/assets/f598fbc8-49c4-4426-8002-044848cbaf7e

## Demo

https://gymtracker-m6d3.onrender.com/


## Key Application Features

* **Workouts and Exercises:** Create custom workouts and attach exercises to them, storing everything in one place.
* **Workout Mode:** Move through exercises set by set, updating weights as you progress.
* **Workout Continuity:** Never lose your place — progress persists across page refreshes or navigation.
* **Protein Tracker:** Set a daily protein goal and log intake, with daily resets.


> Use Case:
> 1. User creates a new workout.
> 2. Adds exercises to the workout.
> 3. Starts **Workout Mode** at the gym.
> 4. Tracks each set and updates weights as needed.
> 5. If the page reloads, **Workout Continuity** allows the user to resume exactly where they left off.
> 6. User updates current protein intake.

## Technologies and libraries used
- **React + TypeScript:** core for building type-safe user interfaces
- **Mantine:** component library for building accessible, responsive, and well-styled UI with minimal overhead
- **React Router:** for declarative routing within the single-page application
- **React Hook Form:** performant form state management with minimal re-renders
- **Zod:** schema-based validation and type-safe form validation
- **Tanstack Query:** server-state management for efficient data fetching, caching, and synchronization
- **Axios:** API communication
- **Prettier:** code formatting and consistency

### Deployment
- **Render:** hosting for frontend, backend and database


## Screenshots
<table>
  <tr>
    <td align="center">
      <strong>Home / Dashboard</strong><br>
      <img width="250" alt="home" src="https://github.com/user-attachments/assets/bfadcde3-3374-4590-8725-75e7d71bb324" />
    </td>
    <td align="center">
      <strong>Exercise List</strong><br>
      <img width="250" alt="exercises" src="https://github.com/user-attachments/assets/18d9019c-5713-4798-b970-aa9f45288672" />
    </td>
    <td align="center">
      <strong>Workout Mode</strong><br>
      <img width="250" alt="workout_mode" src="https://github.com/user-attachments/assets/4ba03f5e-0551-4d9f-813c-41773d5c5a22" />
    </td>
  </tr>
</table>

