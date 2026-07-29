document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================
  // 1. DIALOG MODAL CONTROLS
  // ==========================================
  const ideaDialog = document.getElementById('idea-dialog');
  const openDialogNav = document.getElementById('open-dialog-nav');
  const heroPrimaryCta = document.getElementById('hero-primary-cta');
  const closeDialogBtn = document.getElementById('close-dialog');
  const pricingCtas = document.querySelectorAll('.pricing-cta');
  
  // Show dialog modal
  const openModal = () => {
    resetFormState();
    ideaDialog.showModal();
  };

  // Close dialog modal
  const closeModal = () => {
    ideaDialog.close();
  };

  openDialogNav.addEventListener('click', openModal);
  heroPrimaryCta.addEventListener('click', openModal);
  closeDialogBtn.addEventListener('click', closeModal);

  // Bind pricing card CTA actions
  pricingCtas.forEach(btn => {
    btn.addEventListener('click', () => {
      openModal();
      // Pre-populate category or title based on selection if desired
      const packageName = btn.getAttribute('data-package');
      const requirementsField = document.getElementById('project-requirements');
      if (packageName && requirementsField) {
        requirementsField.value = `Selected package: ${packageName}.\n\nRequirements outline:\n`;
      }
    });
  });

  // Handle ESC closing natively (resets state)
  ideaDialog.addEventListener('cancel', () => {
    resetFormState();
  });

  // ==========================================
  // 2. BUDGET RANGE SLIDER VALUE UPDATER
  // ==========================================
  const budgetRange = document.getElementById('project-budget');
  const budgetValOutput = document.getElementById('budget-value');

  budgetRange.addEventListener('input', (e) => {
    budgetValOutput.textContent = `$${e.target.value}`;
  });

  // ==========================================
  // 3. TESTIMONIALS SLIDER
  // ==========================================
  const sliderTrack = document.getElementById('testimonial-track');
  const prevSlideBtn = document.getElementById('prev-slide');
  const nextSlideBtn = document.getElementById('next-slide');
  const slides = document.querySelectorAll('.slide');
  let currentSlide = 0;

  const updateSlider = () => {
    sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
  };

  nextSlideBtn.addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % slides.length;
    updateSlider();
  });

  prevSlideBtn.addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateSlider();
  });

  // ==========================================
  // 4. MULTI-STEP FORM VALIDATION & FLOW CONTROLLER
  // ==========================================
  const projectForm = document.getElementById('project-idea-form');
  const steps = [
    document.getElementById('step-1'),
    document.getElementById('step-2'),
    document.getElementById('step-3')
  ];
  const stepIndicators = [
    document.getElementById('p-step-1'),
    document.getElementById('p-step-2'),
    document.getElementById('p-step-3')
  ];
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const dialogFooter = document.getElementById('dialog-footer');
  const successScreen = document.getElementById('success-screen');
  const btnSuccessClose = document.getElementById('btn-success-close');
  
  let activeStepIdx = 0;

  // Validation Checkers per Step
  const validateField = (inputEl, errorEl) => {
    let isValid = inputEl.checkValidity();

    // Custom validations
    if (inputEl.type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(inputEl.value)) {
        isValid = false;
        inputEl.setCustomValidity('Invalid email');
      } else {
        inputEl.setCustomValidity('');
      }
    }

    if (isValid) {
      errorEl.style.display = 'none';
      inputEl.classList.remove('is-invalid');
    } else {
      errorEl.style.display = 'block';
      inputEl.classList.add('is-invalid');
    }
    
    return isValid;
  };

  // Bind validations to BLUR/FOCUSOUT (as per Guidelines)
  const fieldsConfig = [
    { id: 'student-name', errorId: 'name-error' },
    { id: 'student-email', errorId: 'email-error' },
    { id: 'student-uni', errorId: 'uni-error' },
    { id: 'project-category', errorId: 'category-error' },
    { id: 'project-title', errorId: 'title-error' },
    { id: 'project-timeline', errorId: 'timeline-error' },
    { id: 'project-requirements', errorId: 'requirements-error' }
  ];

  fieldsConfig.forEach(cfg => {
    const inputEl = document.getElementById(cfg.id);
    const errorEl = document.getElementById(cfg.errorId);
    
    if (inputEl && errorEl) {
      inputEl.addEventListener('blur', () => {
        validateField(inputEl, errorEl);
      });

      // Clear error warnings immediately on active typing/inputting (as per Guidelines)
      inputEl.addEventListener('input', () => {
        errorEl.style.display = 'none';
        inputEl.classList.remove('is-invalid');
        inputEl.setCustomValidity('');
      });
    }
  });

  // Validate all fields for a specific step
  const validateStep = (stepIdx) => {
    let stepValid = true;
    
    if (stepIdx === 0) {
      const nameValid = validateField(document.getElementById('student-name'), document.getElementById('name-error'));
      const emailValid = validateField(document.getElementById('student-email'), document.getElementById('email-error'));
      const uniValid = validateField(document.getElementById('student-uni'), document.getElementById('uni-error'));
      stepValid = nameValid && emailValid && uniValid;
    } else if (stepIdx === 1) {
      const catValid = validateField(document.getElementById('project-category'), document.getElementById('category-error'));
      const titleValid = validateField(document.getElementById('project-title'), document.getElementById('title-error'));
      const timeValid = validateField(document.getElementById('project-timeline'), document.getElementById('timeline-error'));
      stepValid = catValid && titleValid && timeValid;
    } else if (stepIdx === 2) {
      stepValid = validateField(document.getElementById('project-requirements'), document.getElementById('requirements-error'));
    }

    return stepValid;
  };

  // Update UI indicators for step navigation
  const updateStepView = () => {
    steps.forEach((step, idx) => {
      if (idx === activeStepIdx) {
        step.classList.add('active');
        stepIndicators[idx].classList.add('active');
      } else {
        step.classList.remove('active');
        stepIndicators[idx].classList.remove('active');
      }

      // Mark previous steps as complete
      if (idx < activeStepIdx) {
        stepIndicators[idx].classList.add('complete');
      } else {
        stepIndicators[idx].classList.remove('complete');
      }
    });

    // Control Next vs Submit button text and footer visibility
    if (activeStepIdx === 0) {
      prevBtn.style.visibility = 'hidden';
      nextBtn.textContent = 'Next Step';
    } else {
      prevBtn.style.visibility = 'visible';
      if (activeStepIdx === steps.length - 1) {
        nextBtn.textContent = 'Submit Proposal';
      } else {
        nextBtn.textContent = 'Next Step';
      }
    }
  };

  // NEXT / SUBMIT BUTTON CONTROLS
  nextBtn.addEventListener('click', () => {
    // Check validation of active step before advancing
    if (!validateStep(activeStepIdx)) {
      return;
    }

    if (activeStepIdx < steps.length - 1) {
      activeStepIdx++;
      updateStepView();
    } else {
      // Form Submission logic
      submitProposal();
    }
  });

  // PREVIOUS STEP CONTROL
  prevBtn.addEventListener('click', () => {
    if (activeStepIdx > 0) {
      activeStepIdx--;
      updateStepView();
    }
  });

  // SUCCESS DIALOG BUTTON CLOSE
  btnSuccessClose.addEventListener('click', () => {
    closeModal();
  });

  // MOCK FORM SUBMISSION
  const submitProposal = () => {
    // Disable buttons during submit simulation
    nextBtn.disabled = true;
    prevBtn.disabled = true;
    nextBtn.textContent = 'Submitting...';

    // Simulate Network Request Delay
    setTimeout(() => {
      // Hide standard step sections and controls
      steps.forEach(step => step.classList.remove('active'));
      dialogFooter.style.display = 'none';
      stepIndicators.forEach(ind => ind.style.display = 'none');
      
      // Display success message panel
      successScreen.style.display = 'block';
      
      // Re-enable controls internally for next run
      nextBtn.disabled = false;
      prevBtn.disabled = false;
    }, 1200);
  };

  // RESET FORM WORKFLOW
  const resetFormState = () => {
    projectForm.reset();
    activeStepIdx = 0;
    
    // Clear validation error text & styles
    fieldsConfig.forEach(cfg => {
      const inputEl = document.getElementById(cfg.id);
      const errorEl = document.getElementById(cfg.errorId);
      if (inputEl && errorEl) {
        errorEl.style.display = 'none';
        inputEl.classList.remove('is-invalid');
        inputEl.setCustomValidity('');
      }
    });

    // Reset range text display
    budgetValOutput.textContent = `$400`;

    // Show initial form fields
    steps.forEach(step => step.classList.remove('active'));
    steps[0].classList.add('active');
    
    stepIndicators.forEach(ind => {
      ind.style.display = 'block';
      ind.classList.remove('active', 'complete');
    });
    stepIndicators[0].classList.add('active');

    dialogFooter.style.display = 'flex';
    successScreen.style.display = 'none';
    
    prevBtn.style.visibility = 'hidden';
    nextBtn.textContent = 'Next Step';
  };

});
