const issueCounts = document.getElementById("issueCounts");
const issueContainer = document.getElementById("issueContainer");
const btnAll = document.getElementById("btnAll");
const btnOpen = document.getElementById("btnOpen");
const btnClosed = document.getElementById("btnClosed");
let allIssues = [];

const manageSpinner = (status) => {
  if (status == true) {
    document.getElementById("spinner").classList.remove("hidden");
    document.getElementById("issueContainer").classList.add("hidden");
  } else {
    document.getElementById("issueContainer").classList.remove("hidden");
    document.getElementById("spinner").classList.add("hidden");
  }
};
//fetching all issues. push() into allIssue array. counted the length and render the number to html
async function loadIssues() {
  manageSpinner(true);
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
  manageSpinner(false);
}

//displaying fetched data to html
function displayIssues(issues) {
  issueContainer.innerHTML = "";
  issues.forEach((issue) => {
    issueContainer.innerHTML += `
    
    <div 
          onclick="issueModal(${issue.id})" 
          id="card"
          class="bg-white cursor-pointer shadow-sm space-y-2 border-t-8 rounded-md p-6 ${issue.status === "open" ? "border-[#00A96E]" : issue.status === "closed" ? "border-[#A855F7]" : "border-[#6f6f6f]"}"
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
          <p id="description" class="text-[#64748B] line-clamp-2">
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

  if (status === "all") {
    issueCounts.innerText = allIssues.length;
    displayIssues(allIssues);
  } else {
    const openOrcloseFiltered = allIssues.filter(
      (issue) => issue.status === status,
    );
    issueCounts.innerText = openOrcloseFiltered.length;
    displayIssues(openOrcloseFiltered);
  }
};

async function issueModal(issuesId) {
  const res = await fetch(
    `https://phi-lab-server.vercel.app/api/v1/lab/issue/${issuesId}`,
  );
  const data = await res.json();
  const issue = data.data;
  const modal = document.getElementById("issueDetails");
  modal.innerHTML = `
  
          <div class="modal-box space-y-6">
          
          <h3 class="font-bold text-2xl text-black" id="modalTitle">
            ${issue.title}
          </h3> 
        
        <div class="flex items-center justify-between gap-2">
          <span class=" rounded-3xl px-4 font-bold  ${issue.status === "open" ? "text-[#00A96E] bg-[#00a96e32]" : issue.status === "closed" ? "text-[#A855F7] bg-[#a955f732]" : "text-[#000000] bg-[#ffffff32]"}
            ">${issue.status}</span
          >
          <span class="text-lg">&bull;</span>
          <span class="text-center">Opened by <span class="font-bold">${issue.author}</span> </span>
          <span class="text-lg">&bull;</span>
          <span class="text-[#64748B]">${new Date(issue.createdAt).toLocaleDateString()}</span>
        </div>
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
          <p>${issue.description}</p>
          <div class="flex justify-between p-4 rounded-lg bg-[#64748b10]">
            <div>
              <p class="text-[#64748B]">Assignee:</p>
              <p class="font-bold">${issue.assignee}</p>
            </div>
            <div>
              <p class="text-[#64748B]">Priority:</p>
              <div id="priority" class="badge badge-soft ${issue.priority === "high" ? "badge-error" : issue.priority === "medium" ? "badge-warning" : issue.priority === "low" ? "badge-primary" : "badge-success"}">
              ${issue.priority.toUpperCase()}
            </div>
          </div>
          
        </div>
          <div class="modal-action">
      <form method="dialog">
        <!-- if there is a button in form, it will close the modal -->
        <button class="btn">Close</button>
      </form>
    </div>
      </div>
        
          
  `;
  modal.showModal();
}

loadIssues();

//using the function to the iput as onkeup and to the button as onclick method.
async function searchIssues() {
  const input = document.getElementById("searchInput");
  const searchValue = input.value.trim().toLowerCase();
  const filteredIssue = allIssues.filter(
    (issue) =>
      issue.title.toLowerCase().includes(searchValue) ||
      issue.description.toLowerCase().includes(searchValue),
  );
  issueCounts.innerText = filteredIssue.length;
  displayIssues(filteredIssue);
}
