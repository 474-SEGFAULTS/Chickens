// health bar
//Author: Happy

class healthBar {
    constructor(element, initialValue = 0) {
        this.valueElem = element.querySelector('.health-bar-value');
        this.fillElem = element.querySelector('.health-bar-fill');
        // console.log(this.valueElem);
        // console.log(this.fillElem);
        this.setValue(initialValue);
    }
    setValue(newValue) {
        if (newValue < 0) {
            newValue = 0;
        }
        if (newValue > 100) {
            newValue = 100;
        }
        this.value = newValue;
        this.update();
    }

    update() {
        const percentage = this.value + '%';
        this.fillElem.style.width = percentage;
        this.valueElem.textContent = percentage;
    }

}
// const pb1 = new healthBar(document.querySelector('.health-bar'), 75);


