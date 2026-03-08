const issueCounts = document.getElementById("issueCounts");
const issueContainer = document.getElementById("issueContainer");
const btnAll = document.getElementById("btnAll");
const btnOpen = document.getElementById("btnOpen");
const btnClosed = document.getElementById("btnClosed");
let allIssues = [];

//fetching all issues. push() into allIssue array. counted the length and render the number to html
async function loadIssues() {
  const res = await fetch(
    "https://phi-lab-server.vercel.app/api/v1/lab/issues",
  );
  const json = await res.json();
  //   console.log(new Date(json.data[0].createdAt).toLocaleDateString());
  json.data.forEach((issue) => {
    //receiving each index objects(json.data)
    allIssues.push(issue);
  });
  issueCounts.innerText = allIssues.length; //counting by length
  displayIssues(json.data);
}

//displaying fetched data to html
function displayIssues(issues) {
  issueContainer.innerHTML = "";
  issues.forEach((issue) => {
    issueContainer.innerHTML += `
    
    <div
          id="card"
          class="bg-white shadow-sm space-y-2 border-t-8 rounded-md p-6 ${issue.status === "open" ? "border-[#00A96E]" : issue.status === "closed" ? "border-[#A855F7]" : "border-[#6f6f6f]"}"
        >
          <div class="flex justify-between">
            <img id="status" src="${issue.status === "open" ? "assets/Open-Status.png" : "assets/Closed-Status .png"}" alt="" />
            <div id="priority" class="badge badge-soft ${issue.priority === "high" ? "badge-error" : issue.priority === "medium" ? "badge-warning" : issue.priority === "low" ? "badge-primary" : "badge-success"}">
              ${issue.priority.toUpperCase()}
            </div>
          </div>
          <h2 id="title" class="font-semibold text-4">
            ${issue.title}
          </h2>
          <p id="description" class="text-[#64748B]">
            ${issue.description}
          </p>
          <div>
          ${issue.labels
            .map(
              (label) =>
                `
            <div class="label badge badge-warning">${label.toUpperCase()}</div>
            `,
            )
            .join("")}
          </div>
          <hr />
          <div class="flex justify-between">
            <p id="author" class="text-[#64748B]">#${issue.id} by ${issue.author}</p>
            <p id="createdAt" class="text-[#64748B]">${new Date(issue.createdAt).toLocaleDateString()}</p>
          </div>
          <div class="flex justify-between">
            <p id="assignee" class="text-[#64748B]">Assignee: ${issue.assignee}</p>
            <p id="updatedAt" class="text-[#64748B]">updated: ${new Date(issue.updatedAt).toLocaleDateString()}</p>
          </div>
        </div>
    `;
  });
}

let activeBtn = (status) => {
  btnAll.classList.remove("btn-active");
  btnOpen.classList.remove("btn-active");
  btnClosed.classList.remove("btn-active");

  if (status === "all") {
    btnAll.classList.add("btn-active");
  }
  if (status === "open") {
    btnOpen.classList.add("btn-active");
  }
  if (status === "closed") {
    btnClosed.classList.add("btn-active");
  }
};

let filteredIssues = (status) => {
  activeBtn(status);
};

loadIssues();
