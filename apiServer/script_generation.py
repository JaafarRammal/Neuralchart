import json
import textwrap
from string import Template

class ScriptGenerator():
    def __init__(self, json_data, batch_size, epochs, data_path):
        self.data = json.loads(json_data)
        
        self.batch_size = batch_size
        self.layers_list = set()
        self.epochs = epochs
        self.data_path = data_path
        self.program = Template("""import keras
from keras.models import Sequential
import keras.losses 
from keras.layers import $layers_list
from keras import backend as K
import numpy as np

def run_model():
$data_processing

$model_creation
$model_compilation

$model_fitting
""")

    def model_creation(self):
        model_creation = "model = Sequential()\n"

        for node in self.data['nodes']:
            model_creation += "model.add("
            if node['type'] == "Flatten":
                model_creation += "Flatten()"
                self.layers_list.add("Flatten")
            elif node['type'] == "Fully Connected Layer":
                assert len(node['params']) == 3
                model_creation += "Dense({units}, activation=\"{activation}\", use_bias={use_bias}".format(
                    units=node['params']['units'], activation=node['params']['activation'], use_bias=node['params']['use_bias']
                )
                self.layers_list.add("Dense")

            model_creation += ")\n"
        
        return textwrap.indent(model_creation, "    ")

    def model_compilation(self):
        return textwrap.indent("""model.compile(loss=\"{loss}\",
        optimizer=\"{optimiser}\",
        metrics=['accuracy'])""".format(loss=self.data["hyperparameters"]["loss"], optimiser=self.data["hyperparameters"]["optimiser"]), "    ")

    def load_csv(self):
        load_csv = """dataset = np.loadtxt({data_path}, delimiter=\",\")
x_data = dataset[:, :-1]
y_data = dataset[:, -1]""".format(data_path=self.data_path)
        return textwrap.indent(load_csv, "    ")
    
    def model_fitting(self):
        return textwrap.indent("history=model.fit(x_data, y_data, batch_size={batch_size}, nb_epoch={epochs}, validation_split = 0.2, verbose=1)".format(
            batch_size=self.batch_size, epochs=self.epochs
        ), "    ")
    
    def generate(self):
        model = self.model_creation()
        return self.program.substitute(
            layers_list=", ".join(self.layers_list), data_processing=self.load_csv(), model_creation=model, 
            model_compilation=self.model_compilation(), model_fitting=self.model_fitting()
        )