import React, { useEffect } from 'react';

interface DurationSelectProps {
    setSelectedDuration?: React.Dispatch<React.SetStateAction<string>>;
}

const DurationSelect: React.FC<DurationSelectProps> = ({ setSelectedDuration }) => {
    type OptionInfo = {
        value: string;
        text: string;
        disabled?: boolean;
        selected?: boolean;
    };

    const renderDurationDropdown = (element: Element): void => {
        const durationSelect = document.createElement('select');
        durationSelect.title = 'Termin Dauer';
        durationSelect.className = 'duration-select';

        const options: OptionInfo[] = [
            { value: '', text: '15 Minuten', disabled: true, selected: true },
            { value: '15', text: '15 Minuten' },
            { value: '30', text: '30 Minuten' },
            { value: '45', text: '45 Minuten' },
            { value: 'allDay', text: 'Ganztägig' },
            { value: 'custom', text: 'Individuell' }
        ];

        options.forEach(({ value, text, disabled, selected }) => {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = text;
            if (disabled) option.disabled = true;
            if (selected) option.selected = true;
            durationSelect.appendChild(option);
        });

        durationSelect.addEventListener('change', event => handleDurationChange(event.target as HTMLSelectElement));

        element.appendChild(durationSelect);
    };

    function handleDurationChange(durationSelect: HTMLSelectElement): void {
        const selectedValue = durationSelect.value;
        if (selectedValue === 'custom') {
            promptCustomDuration(durationSelect);
        } else if (selectedValue === 'allDay') {
            updateDurationOption(durationSelect, 'Ganztägig');
            //setSelectedDuration(selectedValue);
        } else {
            updateDurationOption(durationSelect, selectedValue + ' Minuten');
            //setSelectedDuration(selectedValue);
        }
    }

    //fehlerbehandlung einfügen + modal
    function promptCustomDuration(durationSelect: HTMLSelectElement): void {
        let userInput = prompt("Bitte geben Sie etwas ein:");
        if (userInput === null) {
            resetDurationSelection(durationSelect);
        } else {
            const duration = userInput || 'custom';
            updateDurationOption(durationSelect, duration + ' Minuten');
            //setSelectedDuration(duration);
        }
    }

    function updateDurationOption(durationSelect: HTMLSelectElement, duration: string): void {
        const displayedOption = durationSelect.options[0];
        displayedOption.text = duration;
        durationSelect.selectedIndex = 0;
    }

    function resetDurationSelection(durationSelect: HTMLSelectElement): void {
        durationSelect.selectedIndex = 0;
    }

    useEffect(() => {
        const toolbarElement = document.querySelector('.fc-duration-button');
        if (toolbarElement) {
            renderDurationDropdown(toolbarElement);
        }
    }, []);

    return (
        <div>

        </div>
    );
};

export default DurationSelect;