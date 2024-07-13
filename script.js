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
      worksGrid.style.display =
        worksGrid.style.display === "none" ? "grid" : "none";
      chevron.style.transform =
        worksGrid.style.display === "none" ? "rotate(-90deg)" : "";
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

// 更新年份
function updateYear() {
  const currentYearElement = document.getElementById("currentYear");
  const currentYear = new Date().getFullYear();
  currentYearElement.textContent = currentYear;
}

function copyToClipboard(text, btnElement) {
  navigator.clipboard
    .writeText(text)
    .then(function () {
      btnElement.innerHTML = '<i class="fas fa-check"></i>';
      btnElement.classList.add("text-green-400");
      setTimeout(function () {
        btnElement.innerHTML = '<i class="fas fa-copy"></i>';
        btnElement.classList.remove("text-green-400");
      }, 2000);
    })
    .catch(function (err) {
      console.error("Unable to copy text to clipboard", err);
    });
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

  window.addEventListener("scroll", () => {
    if (window.scrollY > 750) {
      nav.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
      nav.style.boxShadow = "0 2px 4px rgba(0,0,0,.1)";
    } else {
      nav.style.backgroundColor = "transparent";
      nav.style.boxShadow = "none";
    }
  });
}

function setupSmoothScroll() {
  const scrollArrow = document.querySelector(".fa-chevron-down").parentElement;
  const backToTopButton = document.getElementById("backToTop");

  scrollArrow.addEventListener("click", function (e) {
    e.preventDefault();
    const worksSection = document.getElementById("works");
    if (worksSection) {
      const navHeight = document.querySelector("nav").offsetHeight;
      const targetPosition =
        worksSection.getBoundingClientRect().top +
        window.pageYOffset -
        navHeight;
      smoothScrollTo(targetPosition);
    } else {
      console.error("Works section not found");
    }
  });

  backToTopButton.addEventListener("click", function () {
    smoothScrollTo(0);
  });

  window.addEventListener("scroll", function () {
    if (window.pageYOffset > 300) {
      backToTopButton.classList.remove("opacity-0");
      backToTopButton.classList.add("opacity-100");
    } else {
      backToTopButton.classList.remove("opacity-100");
      backToTopButton.classList.add("opacity-0");
    }
  });
}

function smoothScrollTo(targetPosition) {
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  const duration = 1500;
  let start = null;

  function step(timestamp) {
    if (!start) start = timestamp;
    const progress = timestamp - start;
    const percentage = Math.min(progress / duration, 1);

    window.scrollTo(0, startPosition + distance * easeInOutCubic(percentage));

    if (progress < duration) {
      window.requestAnimationFrame(step);
    }
  }

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  }

  window.requestAnimationFrame(step);
}

document.addEventListener("DOMContentLoaded", function () {
  // 其他初始化代码...
  handleNavScroll();
  setupSmoothScroll();
});
