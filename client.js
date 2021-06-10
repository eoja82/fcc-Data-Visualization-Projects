function getWidth() {
  const w = window.innerWidth
  const projectBtns = document.querySelectorAll(".project")
  console.log(window.innerWidth)
  if (w < 1000) {
    projectBtns.forEach( btn => {
      btn.classList.remove("w3-large")
    })
  } else {
    projectBtns.forEach( btn => {
      btn.classList.add("w3-large")
    })
  }
}
getWidth()
window.addEventListener("resize", getWidth)