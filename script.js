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
    typeElement.innerHTML = `
          <h2 class="text-3xl font-bold mb-6 text-gray-800 flex items-center cursor-pointer">
              <i class="fas fa-chevron-down mr-2 transition-transform duration-300"></i>
              ${type}
          </h2>
          <div class="h-1 w-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6"></div>
      `;

    const worksGrid = document.createElement("div");
    worksGrid.className =
      "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8";

    items.forEach((work) => {
      const workCard = document.createElement("div");
      workCard.className =
        "work-card bg-white rounded-lg overflow-hidden shadow-lg cursor-pointer";

      const primaryLink = getPrimaryLink(work.links);
      workCard.onclick = () => window.open(primaryLink, "_blank");

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
                            ${getOrderedLinks(work.links)
                              .map(
                                (link) => `
                                <a href="${
                                  link.url
                                }" target="_blank" class="text-gray-600 hover:text-gray-800 mr-2" onclick="event.stopPropagation()">
                                    <i class="${getLinkIcon(
                                      link.type
                                    )} fa-lg"></i>
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

    // 修复折叠功能
    const header = typeElement.querySelector("h2");
    const chevron = header.querySelector("i");
    header.addEventListener("click", () => {
      worksGrid.classList.toggle("hidden");
      chevron.classList.toggle("fa-chevron-down");
      chevron.classList.toggle("fa-chevron-right");
    });
  });
}

function getPrimaryLink(links) {
  const order = ["web", "github", "chrome web store", "youtube", "bilibili"];
  for (let type of order) {
    const link = links.find((l) => l.type.toLowerCase() === type);
    if (link) return link.url;
  }
  return links[0]?.url || "#";
}

function getOrderedLinks(links) {
  const order = ["web", "github", "chrome web store", "youtube", "bilibili"];
  return links.sort(
    (a, b) =>
      order.indexOf(a.type.toLowerCase()) - order.indexOf(b.type.toLowerCase())
  );
}

function getLinkIcon(type) {
  switch (type.toLowerCase()) {
    case "github":
      return "fab fa-github";
    case "youtube":
      return "fab fa-youtube";
    case "web":
      return "fas fa-link";
    case "bilibili":
      return "fab fa-bilibili";
    case "chrome web store":
      return "fab fa-chrome";
    default:
      return "fas fa-link";
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
  animateHeroText();
  const works = await loadWorks();
  renderWorks(works);
  updateYear();
});

function handleNavScroll() {
  const nav = document.getElementById("mainNav");
  let lastScrollTop = 0;

  window.addEventListener("scroll", () => {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop) {
      // 向下滚动
      nav.style.transform = "translateY(-100%)";
    } else {
      // 向上滚动
      nav.style.transform = "translateY(0)";
      nav.style.backgroundColor =
        scrollTop > 50 ? "rgba(255, 255, 255, 0.8)" : "transparent";
    }
    lastScrollTop = scrollTop;
  });
}

document.addEventListener("DOMContentLoaded", handleNavScroll);
