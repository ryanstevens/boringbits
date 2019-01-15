# Yeoman generator for boringbits

This is a __built in__ yeoman generator to allow developers the ability to create entire boring applications, or add new components to their pre-existing boring code bases.

### Why is it built in?

The short answer is generators are started, then typically fall out of sync with the frameworks they are generating over time.  By putting the generator inside of each boring release, we  hve better (easier) mechanisms to ensure generator <-> framework comparability.  Another reason so ever boring based application that uses the framework also has the ability to instantly generate new / more components.  Lastly, the general practice of installing global modules as the `yeoman` ecosystem further encourages generators to become stale on peoples machine, so boring maintainers preferred to abstract away that yeoman or a "generator" was even at play as so much providing the ability for boring can create scaffolding to users.

# Usage
```bash
# make a new directory
mkdir new-app
cd new-app

npm install boringbits@latest --save


```