import SummaryTiles from "../dashboard/SummaryTiles";
import LineGraph from "../dashboard/LineGraph";
import BarGraph from "../dashboard/BarGraph";
import EnrollmentForm from "../enrollment/EnrollmentForm";
import EventsList from "../events/EventsList";
import ContactInfo from "../contact/ContactInfo";
import useDashboard from "../../hooks/useDashboard";

const UserPreview = ({ onBack }) => {
  const { data, refetch } = useDashboard();

  return (
    <div>
      <div className="preview-bar">
        <button onClick={onBack} className="btn-back">← Back to Admin</button>
        <span>Previewing User Layout</span>
      </div>
      <main className="main-content">
        <section id="dashboard">
          <SummaryTiles cards={data.cards} />
          <div className="graphs-row">
            <BarGraph barData={data.barGraph} />
            <LineGraph lineData={data.lineGraph} />
          </div>
        </section>
        <section id="enrollment">
          <EnrollmentForm onEnrollSuccess={refetch} />
        </section>
        <section id="events">
          <EventsList />
        </section>
        <section id="contact">
          <ContactInfo />
        </section>
      </main>
    </div>
  );
};

export default UserPreview;