import json
from string import Template

class ScriptGenerator():
    def __init__(self, json_data):
        self.data = json.loads(json_data)

        self.program = Template("""import keras
from keras.models import Sequential
import keras.losses 
from keras.layers import $layers_list
from keras import backend as K

$model_creation
$model_compilation
$model_fitting
""")

    def model_creation(self):
        model_creation = "model = Sequential()\n"
        layers_list = set()

        for node in self.data['nodes']:
            model_creation += "model.add("
            if node['type'] == "Flatten":
                model_creation += "Flatten()"
                layers_list.add("Flatten")
            elif node['type'] == "Fully Connected Layer":
                assert len(node['params']) == 3
                model_creation += "Dense({units}, activation={activation}, use_bias={use_bias}".format(
                    units=node['params']['units'], activation=node['params']['activation'], use_bias=node['params']['use_bias']
                )
                layers_list.add("Dense")
        
            model_creation += ")\n"
        
        return model_creation, layers_list

    def model_compilation(self):
        return """model.compile(loss={loss},
        optimizer={optimiser},
        metrics=['accuracy'])""".format(loss=self.data["hyperparameters"]["loss"], optimiser=self.data["hyperparameters"]["optimiser"])

