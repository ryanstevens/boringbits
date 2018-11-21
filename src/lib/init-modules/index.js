
import paths from 'paths'
import requireInject from 'require-inject-all'

  /**
   * Hooks do not need to export anything, by default the
   * name of the hook will be the module name
   */
module.exports = async function initModules(BoringInjections) {

  const {
    boring
  } = BoringInjections;


  return await requireInject([paths.boring_modules, paths.server_modules], BoringInjections)

}