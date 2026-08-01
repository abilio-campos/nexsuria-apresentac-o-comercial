update portal_settings
set value = jsonb_set(
  value,
  '{elStyles}',
  coalesce((
    select jsonb_object_agg(k, v)
    from jsonb_each(value->'elStyles') as e(k, v)
    where k not like '/|%'
  ), '{}'::jsonb)
)
where key = 'config' and value ? 'elStyles';