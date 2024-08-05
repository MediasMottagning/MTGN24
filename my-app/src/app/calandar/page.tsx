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
    </div>
  );
}
