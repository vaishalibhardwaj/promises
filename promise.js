class MyPromise {
    constructor(executor) {
      this.state = 'pending';
      this.value = undefined;
      this.handlers = [];
  
      const resolve = (value) => {
        if (this.state === 'pending') {
          this.state = 'fulfilled';
          this.value = value;
          this.handlers.forEach(handler => handler.onFulfilled(value));
        }
      };
  
      const reject = (reason) => {
        if (this.state === 'pending') {
          this.state = 'rejected';
          this.value = reason;
          this.handlers.forEach(handler => handler.onRejected(reason));
        }
      };
  
      try {
        executor(resolve, reject);
      } catch (error) {
        reject(error);
      }
    }
  
    then(onFulfilled, onRejected) {
      return new MyPromise((resolve, reject) => {
        const handle = (handler) => {
          try {
            const result = handler(this.value);
            if (result instanceof MyPromise) {
              result.then(resolve, reject);
            } else {
              resolve(result);
            }
          } catch (error) {
            reject(error);
          }
        };
  
        if (this.state === 'pending') {
          this.handlers.push({
            onFulfilled: value => handle(onFulfilled),
            onRejected: reason => handle(onRejected)
          });
        } else if (this.state === 'fulfilled') {
          handle(onFulfilled);
        } else if (this.state === 'rejected') {
          handle(onRejected);
        }
      });
    }
  }
  
  // using it here...
  const promise = new MyPromise((resolve, reject) => {
    setTimeout(() => {
      resolve('Success!');
    }, 2000);
  });
  
  promise.then(
    value => console.log('Resolved:', value),
    reason => console.log('Rejected:', reason)
  );
  
  // Visualizing promise state changing in the terminal
  console.log('Promise status:', promise.state); // this is the initial state
  
  setTimeout(() => {
    console.log('Promise status:', promise.state); // this is a state after 2 seconds
  }, 2000);
  