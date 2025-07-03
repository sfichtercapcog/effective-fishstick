// Global variables for managing application state
let allGrants = [];
let attributes = [];
let communities = [];
let filterConfig = {
    textSearch: '',
    filters: {
        'Type of Grant': ['All'],
        'Funding Source': ['All'],
        'Target Award Amount': null,
        'Application Deadline': null,
        'Deadline Direction': 'onOrBefore',
        'Max Application Hours': null,
        'Community': null
    },
    sort: [
        { attr: 'Grant Name', direction: 'ascending' },
        { attr: null, direction: 'ascending' }
    ]
};
let favorites = [];

class GrantsManager {
    constructor() {
        this.container = document.getElementById('grantsContainer');
        this.filterSummary = document.getElementById('filterSummary');
        this.loadSavedData();
        document.addEventListener('DOMContentLoaded', () => {
            this.setupEventListeners();
            this.loadGrants();
        });
    }

    async loadGrants() {
        this.showLoading();
        try {
            const [grantsResponse, communitiesResponse] = await Promise.all([
                fetch('/assets/json/grants.json'),
                fetch('/assets/json/communities.json')
            ]);
            if (!grantsResponse.ok) throw new Error(`HTTP error loading grants! status: ${grantsResponse.status}`);
            if (!communitiesResponse.ok) throw new Error(`HTTP error loading communities! status: ${communitiesResponse.status}`);
            
            allGrants = await grantsResponse.json();
            communities = await communitiesResponse.json();
            if (!Array.isArray(allGrants) || !allGrants.length || !Array.isArray(communities) || !communities.length) {
                this.showError('No grants or communities available. Please check back later.');
                return;
            }
            
            attributes = this.extractAttributes(allGrants[0]);
            this.setupFilterControls();
            this.updateSuggestions();
            this.displayGrants();
            this.startCountdowns();
        } catch (err) {
            console.error('Error loading data:', err);
            this.showError(`Failed to load data: ${err.message}. Please try again later.`);
        }
    }

    extractAttributes(sampleGrant) {
        return Object.keys(sampleGrant).filter(k => k !== 'grantId');
    }

    showLoading() {
        this.container.innerHTML = '<div class="loading">Loading Grants...</div>';
    }

    showError(message) {
        this.container.innerHTML = `<div class="grant-card error"><p>${message}</p></div>`;
    }

    setupFilterControls() {
        const controls = document.getElementById('filterControls');
        if (!controls) return;
        this.populateCheckboxOptions('typeFilter', 'Type of Grant', filterConfig.filters['Type of Grant']);
        this.populateCheckboxOptions('fundingFilter', 'Funding Source', filterConfig.filters['Funding Source']);
        this.populateCommunityOptions('communityFilter', filterConfig.filters['Community']);
        this.populateSortOptions('sort1Attr', filterConfig.sort[0].attr);
        this.populateSortOptions('sort2Attr', filterConfig.sort[1].attr);
        document.getElementById('sort1Dir').value = filterConfig.sort[0].direction;
        document.getElementById('sort2Dir').value = filterConfig.sort[1].direction;
        this.populateDeadlineDirection('deadlineDirection', filterConfig.filters['Deadline Direction']);
        this.applySavedFilters();
        this.setupCheckboxListeners();
    }

    populateCheckboxOptions(groupId, attr, selectedValues) {
        const container = document.getElementById(groupId);
        if (!container) return;
        const uniqueValues = [...new Set(allGrants.map(g => g[attr] || ''))].sort().filter(v => v);
        selectedValues = Array.isArray(selectedValues) ? selectedValues : ['All'];
        container.innerHTML = `
            <div class="checkbox-item">
                <input type="checkbox" id="${groupId}All" name="${groupId}All" value="all" ${selectedValues.includes('All') ? 'checked' : ''}>
                <label for="${groupId}All">All</label>
            </div>
        `;
        uniqueValues.forEach(val => {
            container.innerHTML += `
                <div class="checkbox-item">
                    <input type="checkbox" id="${groupId}_${val}" name="${groupId}_${val}" value="${val}" ${selectedValues.includes(val) ? 'checked' : ''}>
                    <label for="${groupId}_${val}">${val}</label>
                </div>
            `;
        });
    }

    populateCommunityOptions(selectId, selectedValue) {
        const select = document.getElementById(selectId);
        if (!select) return;
        select.innerHTML = '<option value="">Select a Community</option>' + communities.map(community => 
            `<option value="${community.name}" ${community.name === selectedValue ? 'selected' : ''}>${community.name} (${community.jurisdictionType})</option>`).join('');
    }

    populateSortOptions(selectId, selectedValue) {
        const select = document.getElementById(selectId);
        if (!select) return;
        select.innerHTML = '<option value="">None</option>' + attributes.map(attr => 
            `<option value="${attr}" ${attr === selectedValue ? 'selected' : ''}>${attr}</option>`).join('');
    }

    populateDeadlineDirection(selectId, selectedValue) {
        const select = document.getElementById(selectId);
        if (!select) return;
        select.innerHTML = `
            <option value="onOrBefore" ${selectedValue === 'onOrBefore' ? 'selected' : ''}>Before or On</option>
            <option value="onOrAfter" ${selectedValue === 'onOrAfter' ? 'selected' : ''}>After or On</option>
        `;
    }

    setupCheckboxListeners() {
        ['typeFilter', 'fundingFilter'].forEach(groupId => {
            const allCheckbox = document.getElementById(`${groupId}All`);
            const checkboxes = document.querySelectorAll(`#${groupId} input[type="checkbox"]:not(#${groupId}All)`);
            allCheckbox?.addEventListener('change', () => {
                checkboxes.forEach(cb => cb.checked = allCheckbox.checked);
                this.updateFilterConfigFromCheckboxes();
                this.applyFilters();
            });
            checkboxes.forEach(cb => {
                cb.addEventListener('change', () => {
                    if (!Array.from(checkboxes).some(cb => cb.checked)) {
                        allCheckbox.checked = true;
                    } else if (Array.from(checkboxes).every(cb => cb.checked)) {
                        allCheckbox.checked = true;
                    } else {
                        allCheckbox.checked = false;
                    }
                    this.updateFilterConfigFromCheckboxes();
                    this.applyFilters();
                });
            });
        });
    }

    updateFilterConfigFromCheckboxes() {
        ['typeFilter', 'fundingFilter'].forEach(groupId => {
            const checkboxes = document.querySelectorAll(`#${groupId} input[type="checkbox"]:not(#${groupId}All)`);
            const checkedValues = Array.from(checkboxes)
                .filter(cb => cb.checked)
                .map(cb => cb.value);
            filterConfig.filters[groupId === 'typeFilter' ? 'Type of Grant' : 'Funding Source'] = 
                checkedValues.length === checkboxes.length ? ['All'] : checkedValues;
        });
    }

    updateSuggestions() {
        const datalist = document.getElementById('grantSuggestions');
        const suggestions = allGrants.map(g => g['Grant Name']).filter(Boolean);
        datalist.innerHTML = [...new Set(suggestions)].map(s => `<option value="${s}">`).join('');
    }

    applySavedFilters() {
        document.getElementById('searchInput').value = filterConfig.textSearch;
        document.getElementById('targetAward').value = filterConfig.filters['Target Award Amount'] || '';
        document.getElementById('maxHours').value = filterConfig.filters['Max Application Hours'] || '';
        document.getElementById('deadline').value = filterConfig.filters['Application Deadline'] ? 
            filterConfig.filters['Application Deadline'].toISOString().split('T')[0] : '';
        document.getElementById('deadlineDirection').value = filterConfig.filters['Deadline Direction'] || 'onOrBefore';
        document.getElementById('communityFilter').value = filterConfig.filters['Community'] || '';
    }

    applyFilters() {
        const targetAward = document.getElementById('targetAward');
        const maxHours = document.getElementById('maxHours');
        if (targetAward?.value && !targetAward.checkValidity()) {
            alert('Please enter a valid target award amount (positive number).');
            return;
        }
        if (maxHours?.value && !maxHours.checkValidity()) {
            alert('Please enter a valid max application hours (positive number).');
            return;
        }

        filterConfig.textSearch = document.getElementById('searchInput')?.value.toLowerCase() || '';
        this.updateFilterConfigFromCheckboxes();
        filterConfig.filters['Target Award Amount'] = parseFloat(targetAward?.value) || null;
        filterConfig.filters['Application Deadline'] = this.parseDate(document.getElementById('deadline')?.value) || null;
        filterConfig.filters['Deadline Direction'] = document.getElementById('deadlineDirection')?.value || 'onOrBefore';
        filterConfig.filters['Max Application Hours'] = parseFloat(maxHours?.value) || null;
        filterConfig.filters['Community'] = document.getElementById('communityFilter')?.value || null;
        filterConfig.sort[0] = {
            attr: document.getElementById('sort1Attr')?.value || 'Grant Name',
            direction: document.getElementById('sort1Dir')?.value || 'ascending'
        };
        filterConfig.sort[1] = {
            attr: document.getElementById('sort2Attr')?.value || null,
            direction: document.getElementById('sort2Dir')?.value || 'ascending'
        };
        this.saveConfig();
        this.displayGrants();
    }

    parseDate(dateStr) {
        if (!dateStr) return null;
        const date = new Date(dateStr);
        return isNaN(date.getTime()) ? null : date;
    }

    displayGrants() {
        let filteredGrants = allGrants;
        if (document.getElementById('filterControls').style.display !== 'none') {
            filteredGrants = allGrants.filter(grant => {
                const textMatch = this.fuzzySearch(grant, filterConfig.textSearch);
                const typeMatch = !filterConfig.filters['Type of Grant'].length || 
                    filterConfig.filters['Type of Grant'].includes('All') || 
                    filterConfig.filters['Type of Grant'].includes(grant['Type of Grant'] || '');
                const fundingMatch = !filterConfig.filters['Funding Source'].length || 
                    filterConfig.filters['Funding Source'].includes('All') || 
                    filterConfig.filters['Funding Source'].includes(grant['Funding Source'] || '');
                const awardMatch = !filterConfig.filters['Target Award Amount'] || 
                    (grant['Minimum Grant Award'] <= filterConfig.filters['Target Award Amount'] && 
                     grant['Maximum Grant Award'] >= filterConfig.filters['Target Award Amount']);
                const deadlineMatch = !filterConfig.filters['Application Deadline'] || 
                    (grant['Application Deadline'] === 'Rolling' || 
                     (this.parseDate(grant['Application Deadline']) && 
                      (filterConfig.filters['Deadline Direction'] === 'onOrBefore' ?
                       this.parseDate(grant['Application Deadline']) <= filterConfig.filters['Application Deadline'] :
                       this.parseDate(grant['Application Deadline']) >= filterConfig.filters['Application Deadline'])));
                const hoursMatch = !filterConfig.filters['Max Application Hours'] || 
                    (grant['Estimated Application Hours'] || 0) <= filterConfig.filters['Max Application Hours'];
                
                const communityMatch = this.applyCommunityFilter(grant);
                
                return textMatch && typeMatch && fundingMatch && awardMatch && deadlineMatch && hoursMatch && communityMatch;
            });
        }

        filteredGrants.sort((a, b) => {
            for (let { attr, direction } of filterConfig.sort.filter(s => s.attr)) {
                const valA = attr === 'Application Deadline' && a[attr] === 'Rolling' ? '9999-12-31' : a[attr] || '';
                const valB = attr === 'Application Deadline' && b[attr] === 'Rolling' ? '9999-12-31' : b[attr] || '';
                let comparison = 0;
                if (attr === 'Application Deadline') {
                    comparison = (this.parseDate(valA)?.getTime() || new Date('9999-12-31').getTime()) - 
                                (this.parseDate(valB)?.getTime() || new Date('9999-12-31').getTime());
                } else if (typeof valA === 'number') {
                    comparison = valA - valB;
                } else {
                    comparison = valA.toString().localeCompare(valB.toString());
                }
                if (comparison !== 0) return direction === 'ascending' ? comparison : -comparison;
            }
            return 0;
        });

        this.container.innerHTML = filteredGrants.length === 0 ?
            '<div class="grant-card"><p>No grants match your criteria.</p></div>' :
            filteredGrants.map(grant => this.createGrantCard(grant)).join('');
        this.updateFilterSummary(filteredGrants.length);
        this.observeCards();
    }

    applyCommunityFilter(grant) {
        const selectedCommunityName = filterConfig.filters['Community'];
        if (!selectedCommunityName) return true;

        const community = communities.find(c => c.name === selectedCommunityName);
        if (!community) return false;

        const populationMatch = !grant['Eligible Populations'] || 
            (community.population >= (grant['Eligible Populations'].min || 0) && 
             community.population <= (grant['Eligible Populations'].max || Infinity));
        
        const lmiMatch = !grant['LMI Requirement'] || 
            community.lmiPercentage >= grant['LMI Requirement'];

        const jurisdictionMatch = !grant['Eligible Jurisdiction Type'] || 
            grant['Eligible Jurisdiction Type'].toLowerCase() === 'all' || 
            grant['Eligible Jurisdiction Type'].toLowerCase() === community.jurisdictionType.toLowerCase();

        return populationMatch && lmiMatch && jurisdictionMatch;
    }

    fuzzySearch(grant, term) {
        if (!term) return true;
        return attributes.some(attr => 
            (grant[attr] || '').toString().toLowerCase().includes(term));
    }

    createGrantCard(grant) {
        const isFavorite = favorites.includes(grant.grantId);
        const deadlineClass = this.parseDate(grant['Application Deadline']) && 
            this.parseDate(grant['Application Deadline']) < new Date() ? 'passed' : '';
        let matchRequirements = grant['Match Requirements'];
        if (typeof matchRequirements === 'number') {
            matchRequirements = `${(matchRequirements * 100).toFixed(matchRequirements % 1 !== 0 ? 2 : 0)}%`;
        }
        return `
            <div class="grant-card" tabindex="0" data-grant-id="${grant.grantId}">
                <h3>${grant['Grant Name'] || 'Untitled'}</h3>
                <p><span class="tag ${grant['Type of Grant']?.toLowerCase()}">${grant['Type of Grant'] || 'N/A'}</span></p>
                <p><strong>Funding:</strong> ${grant['Funding Source'] || 'N/A'}</p>
                <p><strong>Award:</strong> $${(grant['Minimum Grant Award'] || 0).toLocaleString()} - $${(grant['Maximum Grant Award'] || 0).toLocaleString()}</p>
                <p class="deadline ${deadlineClass}"><strong>Deadline:</strong> ${grant['Application Deadline'] || 'N/A'}</p>
                <p class="countdown" data-deadline="${grant['Application Deadline']}"></p>
                ${matchRequirements ? `<p><strong>Match Requirements:</strong> ${matchRequirements}</p>` : ''}
                <button class="favorite-btn ${isFavorite ? 'active' : ''}" data-grant-id="${grant.grantId}" aria-label="${isFavorite ? 'Remove from' : 'Add to'} favorites">
                    <i class="fas fa-star"></i>
                </button>
            </div>`;
    }

    updateFilterSummary(count) {
        const summary = [];
        if (filterConfig.textSearch) summary.push(`Search: "${filterConfig.textSearch}"`);
        if (filterConfig.filters['Type of Grant'].includes('All') || filterConfig.filters['Type of Grant'].length === 0) {
            summary.push(`Grant Types: All`);
        } else if (filterConfig.filters['Type of Grant'].length) {
            summary.push(`Grant Types: ${filterConfig.filters['Type of Grant'].join(', ')}`);
        }
        if (filterConfig.filters['Funding Source'].includes('All') || filterConfig.filters['Funding Source'].length === 0) {
            summary.push(`Funding Sources: All`);
        } else if (filterConfig.filters['Funding Source'].length) {
            summary.push(`Funding Sources: ${filterConfig.filters['Funding Source'].join(', ')}`);
        }
        if (filterConfig.filters['Target Award Amount']) summary.push(`Target Award: $${filterConfig.filters['Target Award Amount'].toLocaleString()}`);
        if (filterConfig.filters['Application Deadline']) {
            summary.push(`Deadline: ${filterConfig.filters['Deadline Direction'] === 'onOrBefore' ? 'Before or On' : 'After or On'} ${filterConfig.filters['Application Deadline'].toLocaleDateString()}`);
        }
        if (filterConfig.filters['Max Application Hours']) summary.push(`Max Hours: Up to ${filterConfig.filters['Max Application Hours'].toLocaleString()}`);
        if (filterConfig.filters['Community']) {
            const community = communities.find(c => c.name === filterConfig.filters['Community']);
            if (community) {
                summary.push(`Community: ${community.name} (${community.jurisdictionType}, Population: ${community.population.toLocaleString()}, LMI: ${community.lmiPercentage}%)`);
            }
        }
        this.filterSummary.textContent = `Showing ${count} grants${summary.length ? ' | ' + summary.join(', ') : ''}`;
    }

    observeCards() {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        const cards = document.querySelectorAll('.grant-card');
        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.favorite-btn')) this.showGrantModal(card.dataset.grantId);
            });
            const favBtn = card.querySelector('.favorite-btn');
            if (favBtn) favBtn.addEventListener('click', () => toggleFavorite(favBtn.dataset.grantId));
            observer.observe(card);
        });
    }

    startCountdowns() {
        setInterval(() => {
            document.querySelectorAll('.countdown').forEach(el => {
                const deadline = el.getAttribute('data-deadline');
                if (!deadline || deadline === 'Rolling') {
                    el.textContent = 'Rolling Deadline';
                    return;
                }
                const timeLeft = this.parseDate(deadline) - new Date();
                el.textContent = timeLeft <= 0 ?
                    'Deadline Passed' :
                    `Due in ${Math.floor(timeLeft / (1000 * 60 * 60 * 24))} days ${Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))} hours`;
                el.className = `countdown ${timeLeft <= 0 ? 'passed' : ''}`;
            });
        }, 1000);
    }

    showGrantModal(grantId) {
        const grant = allGrants.find(g => g.grantId === grantId);
        if (!grant) return;
        const modal = document.getElementById('grantModal');
        const modalContent = modal.querySelector('.modal-content');
        modalContent.dataset.grantId = grantId;
        document.getElementById('modalTitle').textContent = grant['Grant Name'] || 'Untitled';
        document.getElementById('modalDetails').innerHTML = attributes.map(attr =>
            `<p><strong>${attr}:</strong> ${attr.includes('Award') && grant[attr] !== undefined ? `$${grant[attr].toLocaleString()}` : 
            attr === 'Match Requirements' && typeof grant[attr] === 'number' ? `${(grant[attr] * 100).toFixed(grant[attr] % 1 !== 0 ? 2 : 0)}%` : 
            attr === 'Eligible Populations' && grant[attr] ? `Min: ${grant[attr].min.toLocaleString()}, Max: ${grant[attr].max?.toLocaleString() || 'Unlimited'}` :
            attr === 'LMI Requirement' && grant[attr] ? `${grant[attr]}%` :
            attr === 'Eligible Jurisdiction Type' && grant[attr] ? grant[attr] :
            grant[attr] !== undefined ? grant[attr].toString() : 'N/A'}</p>`
        ).join('');
        document.getElementById('favoriteBtn').textContent = favorites.includes(grantId) ? 'Remove from Favorites' : 'Add to Favorites';
        modal.style.display = 'flex';
        modalContent.focus();
        this.trapFocus(modal);
    }

    showHelpModal() {
        const modal = document.getElementById('helpModal');
        modal.style.display = 'flex';
        const modalContent = modal.querySelector('.modal-content');
        modalContent.focus();
        this.trapFocus(modal);
    }

    trapFocus(modal) {
        const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        modal.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        });
    }

    setupEventListeners() {
        const debounceSearch = () => {
            clearTimeout(this.searchTimeout);
            this.searchTimeout = setTimeout(() => this.applyFilters(), 300);
        };
        document.getElementById('searchInput')?.addEventListener('input', debounceSearch);
        document.getElementById('applyFilters')?.addEventListener('click', () => this.applyFilters());
        document.getElementById('resetFilters')?.addEventListener('click', () => this.resetFilters());
        document.getElementById('toggleFiltersBtn')?.addEventListener('click', toggleFilters);
        document.getElementById('favoriteBtn')?.addEventListener('click', () => toggleFavorite());
        document.getElementById('copyDetailsBtn')?.addEventListener('click', copyGrantDetails);
        document.getElementById('closeGrantModal')?.addEventListener('click', () => closeModal('grantModal'));
        document.getElementById('communityFilter')?.addEventListener('change', () => this.applyFilters());
        document.getElementById('deadlineDirection')?.addEventListener('change', () => this.applyFilters());
        document.getElementById('helpBtn')?.addEventListener('click', () => this.showHelpModal());
        document.getElementById('closeHelpModal')?.addEventListener('click', () => closeModal('helpModal'));
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeModal(modal.id);
            });
        });
        const filterInputs = document.querySelectorAll('#filterControls input, #filterControls .checkbox-group input, #filterControls select');
        filterInputs.forEach(input => {
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') this.applyFilters();
            });
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') document.querySelectorAll('.modal').forEach(modal => modal.style.display = 'none');
        });
    }

    resetFilters() {
        filterConfig = {
            textSearch: '',
            filters: {
                'Type of Grant': ['All'],
                'Funding Source': ['All'],
                'Target Award Amount': null,
                'Application Deadline': null,
                'Deadline Direction': 'onOrBefore',
                'Max Application Hours': null,
                'Community': null
            },
            sort: [
                { attr: 'Grant Name', direction: 'ascending' },
                { attr: null, direction: 'ascending' }
            ]
        };
        this.setupFilterControls();
        this.applyFilters();
        this.filterSummary.textContent = '';
    }

    saveConfig() {
        try {
            localStorage.setItem('filterConfig', JSON.stringify(filterConfig));
        } catch (err) {
            console.error('Failed to save filter configuration:', err);
            alert('Could not save filter configuration.');
        }
    }

    loadSavedData() {
        try {
            const savedFavorites = localStorage.getItem('favorites');
            if (savedFavorites) favorites = JSON.parse(savedFavorites);
            const savedConfig = localStorage.getItem('filterConfig');
            if (savedConfig) {
                filterConfig = JSON.parse(savedConfig);
                if (!filterConfig.filters || !filterConfig.filters['Type of Grant'] || !filterConfig.filters['Type of Grant'].length || !filterConfig.filters['Type of Grant'].includes('All')) {
                    filterConfig.filters = filterConfig.filters || {};
                    filterConfig.filters['Type of Grant'] = ['All'];
                }
                if (!filterConfig.filters['Funding Source'] || !filterConfig.filters['Funding Source'].length || !filterConfig.filters['Funding Source'].includes('All')) {
                    filterConfig.filters['Funding Source'] = ['All'];
                }
                if (!filterConfig.filters['Deadline Direction']) {
                    filterConfig.filters['Deadline Direction'] = 'onOrBefore';
                }
                if (!filterConfig.sort[0].attr) {
                    filterConfig.sort[0] = { attr: 'Grant Name', direction: 'ascending' };
                }
            }
        } catch (err) {
            console.error('Failed to load saved data:', err);
        }
    }
}

window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.style.position = 'static';
    } else {
        header.style.position = 'sticky';
        header.style.top = '0';
    }
});

const grantsManager = new GrantsManager();

function copyGrantDetails() {
    const title = document.getElementById('modalTitle').textContent;
    const details = document.getElementById('modalDetails').innerText;
    navigator.clipboard.writeText(`${title}\n${details}`).then(() => {
        alert('Grant details copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy details:', err);
        alert('Failed to copy details to clipboard.');
    });
}

function toggleFavorite(grantId) {
    if (!grantId) {
        const modalContent = document.querySelector('#grantModal .modal-content');
        grantId = modalContent?.dataset.grantId;
    }
    if (!grantId) return;
    const index = favorites.indexOf(grantId);
    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(grantId);
    }
    try {
        localStorage.setItem('favorites', JSON.stringify(favorites));
        grantsManager.displayGrants();
        const modal = document.getElementById('grantModal');
        if (modal && modal.style.display === 'flex') {
            document.getElementById('favoriteBtn').textContent = favorites.includes(grantId) ? 'Remove from Favorites' : 'Add to Favorites';
        }
    } catch (err) {
        console.error('Failed to update favorites:', err);
        alert('Could not update favorites.');
    }
}

function toggleFilters() {
    const controls = document.getElementById('filterControls');
    const toggleBtn = document.getElementById('toggleFiltersBtn');
    const isCollapsed = controls.classList.contains('collapsed');
    if (isCollapsed) {
        controls.classList.remove('collapsed');
        toggleBtn.setAttribute('aria-expanded', 'true');
    } else {
        controls.classList.add('collapsed');
        toggleBtn.setAttribute('aria-expanded', 'false');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'none';
}