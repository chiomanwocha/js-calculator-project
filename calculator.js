(function () {
    document.addEventListener('DOMContentLoaded', function () {
  //event listeners for buttons
      let allNumbers = document.querySelectorAll(".number");
      let allOperators = document.querySelectorAll(".operator");
      let calcDisplay = document.querySelector(".final-result");
      let prevCalc = document.querySelector(".calc-display");
      let backspace = document.querySelector(".backspace");
  
    //global store values
      let operand1 = '';
      let operand2 = '';
      let operator = '';
      let result = '';
  
    //object to store calc functions for each operator
      const operators = {
        '+': (a, b) => a + b,
        '*': (a, b) => a * b,
        '-': (a, b) => a - b,
        '/': (a, b) => a / b,
        // '%': (a, b) => a % b,
      };
  
      //check if operator is clicked, if true, return operand2, else operand1
      function getActiveOperand() {
        return operator ? operand2 : operand1;
      }
  
      function popValues(numString){
        //split string, pop last value, return joined string
        let newNum = numString.split('');
        newNum.pop();
        return newNum.join('');
      }
  
      //all event listeners
      for (let i = 0; i < allNumbers.length; i++) {
        allNumbers[i].addEventListener('click', displayNum);
      }
  
      for (let i = 0; i < allOperators.length; i++){
        allOperators[i].addEventListener('click', (e) => {
          //check active operand
          const activeOperand = getActiveOperand();
          if (e.target.innerHTML === '%' && operand1){
            result = operand1/100;
            operand1 = result;
            calcDisplay.innerHTML = result;
          }
  
          //else, run checkOperators func
          checkOperators(e);
        })
      }
  
      backspace.addEventListener('click', () => {
        //if there's no active operand, return the func
        if (!getActiveOperand()) return;
  
        //pop operand2 if operator is pressed
        if(operator) {
          operand2 = popValues(operand2);
          calcDisplay.innerHTML = operand2;
          return;
        }
  
        //else, pop, operand1
        operand1 = popValues(operand1)
        calcDisplay.innerHTML = operand1;
      });
  
      function displayNum (val) {
        //pick value from click
        const value = val.target.innerHTML;
        //check active operand
        const activeOperand = getActiveOperand();
        //if value is decimal and activeOperand already has a decimal, return func
        if(value === "." && activeOperand.indexOf(value) >= 0){
          return;
        }
        //if operator is pressed, append values to operand2, else operand1
        operator ? operand2 += value : operand1 += value;
        calcDisplay.innerHTML = operator ? operand2 : operand1;
      }
  
      //reset all global values to initial state
      function resetOperands() {
        operand1 = '';
        operand2 = '';
        operator = '';
      }
  
      function round(num) {
        //add Number.EPSILON(number > 0 but Less that 1) to num to increase decimal places multiplied by 100, round, and divide by 100 to get 2 decimal places - multiply by 1000 for 3DP
        return Math.round((num + Number.EPSILON) * 100) / 100;
      }
  
      function checkOperators(val) {
        // val.classList.remove('active');
        //get value from clicked button
        let value = val.target.innerHTML;
  
        //if "C", resetOperands func is called, and display is cleared
        if (value === 'C') {
          resetOperands();
          calcDisplay.innerHTML = '0';
          prevCalc.innerHTML = '';
          return;
        }
  
        //if result is present and operand1 isn't, set result to operand1
        if (result && !operand1) {
          operand1 = result;
        }
  
        // If there are no operands yet, prevent the use of an operator
        // Prevent using `=` as the first operator, return
        if (!operand1 || (!operator && value === '=')) return;
  
        //if operand2 is false, set operator to current value clicked
        if (!operand2) {
          operator = value;
          return;
        }
  
        //if operators object[val] is false, display Err! and reset all operands, return
        if (!operators[operator]) {
          calcDisplay.innerHTML = 'Err!';
          resetOperands();
          return;
        };
  
        // Calculate
        //call operator object on both operands, wrap in round func.
        result = `${round(operators[operator](parseFloat(operand1), parseFloat(operand2)))}`;
        //set display to previous calc values
        prevCalc.innerHTML = `${operand1} ${operator} ${operand2}`;
        resetOperands();
        calcDisplay.innerHTML = result;
  
        //if value operator is equalsto, set operand1 to result, and operator to value
        if (value !== '=') {
          operand1 = result;
          operator = value;
        }
      }
    })
  })();