# Yeoman generator for boringbits

This is a __built in__ yeoman generator to allow developers the ability to create entire boring applications, or add new components to their pre-existing boring code bases.

### Why is it built in?

The short answer is generators are started, then typically fall out of sync with the frameworks they are generating over time.  By putting the generator inside of each boring release, we  hve better (easier) mechanisms to ensure generator <-> framework comparability.  Another reason so ever boring based application that uses the framework also has the ability to instantly generate new / more components.  Lastly, the general practice of installing global modules as the `yeoman` ecosystem further encourages generators to become stale on peoples machine, so boring maintainers preferred to abstract away that yeoman or a "generator" was even at play as so much providing the ability for boring can create scaffolding to users.

## Usage

### Option 1, install boringbits and use the built in generator
```bash
# make a new directory
mkdir my-boring-app
cd my-boring-app

# make a package.json and install boringbits
npm init -y && npm install boringbits@latest --save

npx boring generate
```

### OR Option 2, use the `create-boring-app` cli
```bash
# create-boring-app is NOT a yeoman generator itself
# but a tiny wrapper that simply installs boringbits@latest
# and automates the option 1
npx create-boring-app my-boring-app
```