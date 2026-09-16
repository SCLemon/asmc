const lazy = {
  mounted(el) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.src = el.dataset.src
          observer.unobserve(el)
        }
      },
      {
        threshold: 0.1
      }
    )

    observer.observe(el)
  }
}

export default lazy