from sqlalchemy import Column, String, DateTime
import datetime
from database.database import Base
class EventLog(Base):
    __tablename__ = 'event_log'

    # ID único del evento
    event_id = Column(String(100), primary_key=True)
    # Tipo de evento (por ejemplo, 'user:created')
    event_type = Column(String(100), nullable=False)
    # Fecha y hora de procesamiento del evento
    processed_at = Column(DateTime, default=datetime.datetime.now, nullable=False)
