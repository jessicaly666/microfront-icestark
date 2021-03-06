import module0 from '../plugins/react-app/pluginRuntime/runtime';
import module1 from '../plugins/router/pluginRuntime/runtime';
import module2 from '../plugins/auth/pluginRuntime/runtime';
import module3 from '../plugins/icestark/pluginRuntime/runtime';

interface IRuntime<T> {
  loadModule: (module: { default: T } | T) => void;
}

function loadRuntimeModules(runtime: IRuntime<Function>) {
  runtime.loadModule(module0);
  runtime.loadModule(module1);
  runtime.loadModule(module2);
  runtime.loadModule(module3);
}

export default loadRuntimeModules;
