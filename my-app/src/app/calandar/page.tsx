export default function Calandar() {
  return (
    <div>
      <iframe
        src="https://embed.styledcalendar.com/#xprZOkwWyOCZ8omjA6Gm"
        title="Styled Calendar"
        className="styled-calendar-container"
        style={{
          width: "100%",
          height: "100vh",
          border: "none",
          display: "block",
        }}
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
