# Factory Robots

Check the `api.ts` for the overview of the system.

The `main.ts` has simple `Robot` and `Controller` implementation, doing basic movement.

The `test.ts` has basic tests.

# How to run

```bash
npm install
npm run build
npm run main
```

There should be messages from the robot moving back and forth:

```
Robot  F1/R: started
Skynet     : started
Skynet     : running
Skynet     : moving robot F1/R1 in factory F1 to center
Robot  F1/R: moving {"x":0,"y":0} - ["N","E","N","E","N","E","N","E"] -> {"x":4,"y":4}
Robot  F1/R: ping, current position: {"x":4,"y":4}
Skynet     : moving F1/R1 to 0,0
Robot  F1/R: moving {"x":4,"y":4} - ["W","W","W","W","S","S","S","S"] -> {"x":0,"y":0}
Robot  F1/R: ping, current position: {"x":0,"y":0}
Skynet     : moving robot F1/R1 in factory F1 to center
...
```

Running tests

```
npm run test
```

The output should be

```
test calculate new position: ok
test robot can move: ok
test robot doesn't hit the wall: ok
```