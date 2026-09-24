/**
 * ScaleNova Systems — Client API Dispatcher
 * Demo: TechSelf Gadgets (DEMO-10)
 */

window.ScaleNovaAPI = (function () {
  'use strict';

  const config = window.DEMO_CONFIG || {
    demoId: 'DEMO-10',
    industry: 'Next-Gen Electronics & Smart Gadgets',
    clientName: 'TechSelf Gadgets',
    appsScriptUrl: 'https://script.google.com/macros/s/AKfycby-kC_gnWLAMrKc40yu0TOga5yZDreR50X-2AWw2rHrzCFi3oZp2W9Xqq3KXNoTh6bj/exec'
  };

  async function submitLead(formData, options = {}) {
    if (!formData.name || !formData.email) {
      throw new Error('Name and email are required.');
    }

    const payload = {
      demo_id: config.demoId,
      lead_type: (formData.lead_type || 'ORDER').toUpperCase(),
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: (formData.phone || '').trim(),
      company: formData.company || 'Direct Tech Buyer',
      service: formData.product || formData.service || 'Electronics Hardware Order',
      requirement: formData.requirement || 'Gadget Store Checkout',
      project_type: 'Consumer Electronics Order',
      budget: formData.total_amount || '$150 - $400',
      preferred_date: new Date().toISOString().slice(0, 10),
      preferred_time: '',
      message: (formData.message || formData.notes || '').trim(),
      source: 'TechSelf Website',
      source_page: formData.source_page || window.location.pathname || 'Home'
    };

    const optimisticId = 'SN-D10-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-' + Math.floor(1000 + Math.random() * 9000);

    const networkPromise = fetch(config.appsScriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    }).then(async r => {
      try { return await r.json(); } catch (e) { return { success: true, submission_id: optimisticId }; }
    }).catch(() => ({ success: true, submission_id: optimisticId }));

    const quickTimeout = new Promise(resolve => setTimeout(() => {
      resolve({ success: true, submission_id: optimisticId, optimistic: true });
    }, 900));

    try {
      const result = await Promise.race([networkPromise, quickTimeout]);
      return {
        success: true,
        submission_id: (result && (result.submission_id || result.submissionId)) || optimisticId,
        demo_id: 'DEMO-10',
        message: 'Order received and queued for dispatch'
      };
    } catch (err) {
      return { success: true, submission_id: optimisticId, demo_id: 'DEMO-10' };
    }
  }

  return { submitLead };
})();
