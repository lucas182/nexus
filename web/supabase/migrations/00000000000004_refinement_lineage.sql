-- Sprint de Refinamento: preserva a origem de cada Event e impede duplicação
-- quando uma captura é processada mais de uma vez.
alter table events
  add column if not exists source_inbox_item_id uuid
  references inbox_items (id) on delete set null;

create unique index if not exists events_source_inbox_item_id_key
  on events (source_inbox_item_id)
  where source_inbox_item_id is not null;

create index if not exists events_timestamp_idx on events (timestamp desc);
create index if not exists threads_updated_at_idx on threads (updated_at desc);
