# 🕒Interactive Stopwatch & Workout Tracker

This is a simple web-based workout tracker built using HTML, CSS, and JavaScript.<br/>

### The app allows users to:
* Track cardio workouts using a stopwatch
* Track strength workouts using rep counting
* View workout history (sessions and sets)
* Switch between different exercise types
* Enjoy smooth animations and visual effects

# 🚀 Features

### 🏠 Home Screen
* Clean landing page
* Animated background bubbles & waves (clickable background)
* Smooth transition to exercise selection

### 🏃 Cardio Mode (Timer)
* Real-time stopwatch
* Shows hours, minutes, seconds, and milliseconds
* START begins timer
* STOP pauses timer and logs the session automatically
* RESET clears time and session history
* Each time you press STOP, a new session is saved below the timer.

### 💪 Strength Mode (Reps)
* Automatically counts reps at a steady pace
* START begins rep counting
* STOP logs the completed set automatically
* RESET clears all sets
* Each time you press STOP, your completed reps are saved as a new set.

### 🌊 Calm Mode
* Click on the background to activate calm mode
* Animated waves appear using the Canvas API
* Click again to return to normal mode

### 🛠 Technologies Used
* HTML
* CSS
* JavaScript
* GSAP (for animations)
* Canvas API (for wave animation)

### 🧠 How It Works
* Timer Logic
* Uses Date.now() to calculate accurate time
* Updates every 10 milliseconds
* Stores session times dynamically in the DOM
* Reps Logic
* Uses setInterval() to increase rep count
* Automatically logs sets when STOP is pressed
* Clears history on RESET
* Page Transitions
* Uses GSAP animations for smooth transitions
* Switches between Home, Exercise Selection, and Workout Page

# 📂 Project Structure
/assets\
   &ensp; /icons\
/STOPWATCH.html\
/style.css\
/script.js\
README.md

>[!NOTE]
>The codes are placed in the file names.

# 📚 What I Learned
* How to build a stopwatch from scratch
* How to manage application state (timer vs reps mode)
* How to dynamically create and display elements in JavaScript
* How to use GSAP for animations
* How to use the Canvas API for background effects

# How to run it
* Open the project folder in VS Code
* Install the Live Server extension (if you don’t have it)
* Right-click index.html
* Click "Open with Live Server"
  
### This will:
* Run the project in your browser
* Automatically refresh when you save changes

>[!IMPORTANT]
>### Requirements
>A modern web browser (Chrome, Edge, Firefox, Safari)
>Internet connection (for GSAP and external libraries)
</br>

>[!TIP]
>## 🔮 Future Improvements
>* Save workout history using LocalStorage
>* Add a workout summary dashboard
>* Improve mobile responsiveness
>* Add rest timers between sets
>* Track total workout duration

# 💡 Purpose of This Project

### This project was created to practice:
* JavaScript logic
* Animation techniques
* UI/UX design thnking
* Building interactive web applications without frameworks
