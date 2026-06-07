async function notifyCompanyRegistrationSubmitted() {
  return {
    provider: 'noop',
    status: 'skipped'
  };
}

module.exports = {
  notifyCompanyRegistrationSubmitted
};
