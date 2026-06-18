import EventForm from "./EventForm";
import EventBanner from "./EventBanner";
import "../../styles/events.css";

const EventsList = () => {
  return (
    <div className="section-container">
      <EventForm />
      <EventBanner />
    </div>
  );
};

export default EventsList;