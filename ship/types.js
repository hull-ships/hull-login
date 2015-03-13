import t from 'tcomb-form';

export default {
  Email: t.subtype(t.Str, function(value) {
    return /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(value);
  })
}

