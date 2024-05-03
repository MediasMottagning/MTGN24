import "./calandar.css";

export default function Calandar() {
  return (
    <div className="center">
      <h1></h1>
      <iframe
        src="https://embed.styledcalendar.com/#xprZOkwWyOCZ8omjA6Gm"
        title="Styled Calendar"
        className="styled-calendar-container"
        style={{ width: "100%", border: "none" }}
        data-cy="calendar-embed-iframe"
      ></iframe>
      <script
        async
        type="module"
        src="https://embed.styledcalendar.com/assets/parent-window.js"
      ></script>
      <iframe
        src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=Europe%2FStockholm&bgcolor=%23ffffff&src=ZmIzNGYxMjQxNTdmODNkYjNjMDM4ZWU3NTk3MWJmMjZiM2Y0ZjQyYWE0NGMxZDlkNDU3MWFhMjEzOTg1NzNhMkBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&color=%238E24AA"
        style={{ border: "solid 1px #777" }}
        width="800"
        height="600"
        scrolling="no"
      ></iframe>
    </div>
  );
}
