const $ = (s) => document.querySelector(s);
const form = $("#goalForm");
const result = $("#result");
const stepsEl = $("#steps");

const templates = {
  career: [
    ["Define the target", "Choose 1–2 specific job types you would realistically apply for."],
    ["Build a simple résumé", "Create a one-page résumé focused on skills, school, volunteering, projects, and relevant experience."],
    ["Find opportunities", "Make a list of 10 legitimate openings from company career pages or trusted job sources."],
    ["Apply carefully", "Tailor your application to each role instead of sending the exact same application everywhere."],
    ["Prepare for interviews", "Practice a 30-second introduction and answers to common questions."],
    ["Follow up", "Track applications and politely follow up when appropriate."]
  ],
  business: [
    ["Define one problem", "Write down exactly who has the problem and why solving it would matter to them."],
    ["Choose a simple offer", "Describe one product or service that solves that problem without adding unnecessary features."],
    ["Validate before spending", "Talk to potential users and look for evidence they actually want the solution."],
    ["Build the smallest version", "Create a basic version you can show, test, or deliver quickly."],
    ["Find first users", "Reach potential customers through appropriate communities, referrals, or useful content—without spamming."],
    ["Learn and improve", "Collect feedback, track what works, and improve the offer before scaling."]
  ],
  learning: [
    ["Define the skill", "Turn the broad topic into one concrete ability you want to gain."],
    ["Pick one learning path", "Choose one reputable beginner resource instead of jumping between many."],
    ["Schedule practice", "Reserve a small, repeatable block of time for focused practice."],
    ["Build something", "Use the skill in a tiny real project rather than only watching tutorials."],
    ["Get feedback", "Compare your work with good examples or ask someone knowledgeable for constructive feedback."],
    ["Level up", "Choose the next project slightly above your current ability."]
  ],
  school: [
    ["Identify the biggest gap", "List your classes and choose the one assignment, topic, or habit that needs attention first."],
    ["Check requirements", "Review the teacher's directions, rubric, due dates, and available class resources."],
    ["Break work into sessions", "Split the work into short tasks that can each be finished in one sitting."],
    ["Use active practice", "Practice recalling, solving, explaining, or writing instead of only rereading notes."],
    ["Ask for help early", "Bring specific questions to your teacher, tutor, or another trusted adult."],
    ["Review progress", "Once a week, check completed work and decide the next priority."]
  ],
  project: [
    ["Define finished", "Write one sentence describing what a completed first version looks like."],
    ["Cut the scope", "Remove anything that is not necessary for version one."],
    ["Gather essentials", "List only the tools, information, and materials required to begin."],
    ["Make version one", "Build the smallest usable version before trying to perfect it."],
    ["Test it", "Use it yourself and ask a few relevant people for specific feedback."],
    ["Improve and publish", "Fix the most important issues and share the finished version."]
  ],
  general: [
    ["Make the goal specific", "Rewrite your goal so you can clearly tell when you've achieved it."],
    ["Find the first milestone", "Choose a meaningful result you can reach before the full goal."],
    ["Remove uncertainty", "List what you need to learn, decide, or obtain before moving forward."],
    ["Schedule action", "Put a realistic block of focused time on your calendar."],
    ["Do a small first version", "Complete something tangible instead of waiting for the perfect plan."],
    ["Review and adjust", "Check what worked, what didn't, and choose the next action."]
  ]
};

function savePlan(plan){ localStorage.setItem("nextstepPlan", JSON.stringify(plan)); }
function getPlan(){ try{return JSON.parse(localStorage.getItem("nextstepPlan"))}catch{return null} }

function render(plan){
  $("#resultGoal").textContent = plan.goal;
  $("#resultMeta").textContent = `${plan.timelineLabel} • ${plan.timeLabel} • ${plan.levelLabel}`;
  stepsEl.innerHTML = "";
  plan.steps.forEach((s,i)=>{
    const div=document.createElement("div");
    div.className="step"+(plan.completed[i]?" done":"");
    div.innerHTML=`<input type="checkbox" ${plan.completed[i]?"checked":""} aria-label="Complete step ${i+1}">
      <div><h3>${i+1}. ${s[0]}</h3><p>${s[1]}</p></div>`;
    div.querySelector("input").addEventListener("change",e=>{
      plan.completed[i]=e.target.checked; savePlan(plan); render(plan);
    });
    stepsEl.appendChild(div);
  });
  const done=plan.completed.filter(Boolean).length;
  const pct=Math.round(done/plan.steps.length*100);
  $("#progressText").textContent=pct+"%"; $("#progressBar").style.width=pct+"%";
  const first=plan.steps[plan.completed.findIndex(x=>!x)] || ["Roadmap complete!"];
  $("#todayAction").textContent = first[0] + (first[1] ? " — " + first[1] : "");
  result.classList.remove("hidden");
}

form.addEventListener("submit",e=>{
  e.preventDefault();
  const cat=$("#category").value;
  const timeline=$("#timeline"), time=$("#time"), level=$("#level");
  const plan={
    goal:$("#goal").value.trim(), category:cat,
    timelineLabel:timeline.options[timeline.selectedIndex].text,
    timeLabel:time.options[time.selectedIndex].text,
    levelLabel:level.options[level.selectedIndex].text,
    steps:templates[cat], completed:Array(templates[cat].length).fill(false)
  };
  savePlan(plan); render(plan); result.scrollIntoView({behavior:"smooth"});
});
document.querySelectorAll(".examples button").forEach(b=>b.onclick=()=>{
  $("#goal").value=b.dataset.goal; $("#category").value=b.dataset.cat; $("#goal").focus();
});
$("#viewSaved").onclick=()=>{const p=getPlan(); if(p){render(p);result.scrollIntoView({behavior:"smooth"})}else{$("#planner").scrollIntoView({behavior:"smooth"})}};
$("#resetBtn").onclick=()=>{$("#goal").value="";result.classList.add("hidden");$("#planner").scrollIntoView({behavior:"smooth"})};
$("#year").textContent=new Date().getFullYear();
const saved=getPlan(); if(saved) render(saved);
