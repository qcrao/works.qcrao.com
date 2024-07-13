// 加载作品数据
async function loadWorks() {
  const response = await fetch("works.json");
  const works = await response.json();
  return works;
}

// 渲染作品
function renderWorks(works) {
  const worksContainer = document.getElementById("worksContainer");
  const groupedWorks = groupWorksByType(works);

  Object.entries(groupedWorks).forEach(([type, items]) => {
    const typeElement = document.createElement("div");
    typeElement.className = "mb-12";
    typeElement.innerHTML = `<h2 class="text-3xl font-bold mb-6 text-gray-800">${type}</h2>`;

    const worksGrid = document.createElement("div");
    worksGrid.className =
      "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8";

    items.forEach((work) => {
      const workCard = document.createElement("div");
      workCard.className =
        "work-card bg-white rounded-lg overflow-hidden shadow-lg";
      workCard.innerHTML = `
                <img src="${work.coverImageUrl}" alt="${
        work.name
      }" class="w-full h-48 object-cover">
                <div class="p-6">
                    <h3 class="text-xl font-semibold mb-2 text-gray-800">${
                      work.name
                    }</h3>
                    <p class="text-gray-600 mb-4">${work.description}</p>
                    <div class="flex justify-between items-center">
                        <span class="text-sm text-gray-500">${
                          work.creationDate
                        }</span>
                        <div>
                ${work.links
                  .map(
                    (link) => `
                    <a href="${
                      link.url
                    }" target="_blank" class="text-gray-600 hover:text-gray-800 mr-2">
                        <i class="fab fa-${getLinkIcon(link.type)} fa-lg"></i>
                    </a>
                `
                  )
                  .join("")}
            </div>
                    </div>
                </div>
            `;
      worksGrid.appendChild(workCard);
    });

    typeElement.appendChild(worksGrid);
    worksContainer.appendChild(typeElement);
  });
}

function getLinkIcon(type) {
  switch (type.toLowerCase()) {
    case "github":
      return "github";
    case "youtube":
      return "youtube";
    case "web":
      return "microphone-lines";
    case "bilibili":
      return "bilibili";
    case "chrome web store":
      return "chrome";
    default:
      return "microphone-lines";
  }
}

// 按类型分组作品
function groupWorksByType(works) {
  return works.reduce((acc, work) => {
    if (!acc[work.type]) {
      acc[work.type] = [];
    }
    acc[work.type].push(work);
    return acc;
  }, {});
}

// 英雄区文字动画
function animateHeroText() {
  const text = "创作使我快乐！";
  const heroText = document.getElementById("heroText");
  gsap.registerPlugin(TextPlugin);
  gsap.to(heroText, {
    duration: 2,
    text: {
      value: text,
      delimiter: "",
    },
    ease: "none",
    repeat: -1,
    yoyo: true,
    repeatDelay: 1,
  });
}

// 复制邮箱
function copyEmail() {
  const email = "qcrao91@gmail.com";
  navigator.clipboard.writeText(email).then(() => {
    const copyIcon = document.getElementById("copyIcon");
    copyIcon.textContent = "✅";
    setTimeout(() => {
      copyIcon.textContent = "📋";
    }, 2000);
  });
}

// 更新年份
function updateYear() {
  const currentYearElement = document.getElementById("currentYear");
  const currentYear = new Date().getFullYear();
  currentYearElement.textContent = currentYear;
}

// 页面加载完成后执行
document.addEventListener("DOMContentLoaded", async () => {
  const works = await loadWorks();
  renderWorks(works);
  animateHeroText();
  updateYear();
});
