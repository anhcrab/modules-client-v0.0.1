
const GoogleReCaptcha = () => {
  const SITE_KEY = '6LduQAEoAAAAALjc0l0nRwRpa10F0WEeUarK97eX'
  const SITE_SECRET_KEY = '6LduQAEoAAAAAM0epHB-wRyO85YYQyl6bMpz7F7I'
  const handleLoaded = _ => {
    window.grecaptcha.ready(_ => {
      window.grecaptcha
        .execute(SITE_KEY, { action: "homepage" })
        .then(token => {
          // ...
        })
    })
  }

  useEffect(() => {
    // Add reCaptcha
    const script = document.createElement("script")
    script.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`
    script.addEventListener("load", handleLoaded)
    document.body.appendChild(script)
  }, [])

  return <div
    className="g-recaptcha"
    data-sitekey={SITE_KEY}
    data-size="invisible"
  ></div>
}

export default GoogleReCaptcha