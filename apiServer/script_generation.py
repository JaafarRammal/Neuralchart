import json
from string import Template

program = Template("""import keras
from keras.models import Sequential
import keras.losses 
from keras.layers import $layers_list
from keras import backend as K

$model_creation
$model_compilation
$model_fitting
""")

def generate_script(json_model):
    data = json.loads(json_model)

def model_creation(data):
    model_creation = "model = Sequential()\n"
    layers_list = set()

    for node in data['nodes']:
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



