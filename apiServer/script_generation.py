import json
import textwrap
from string import Template

class ScriptGenerator():
    def __init__(self, json_data, batch_size, epochs, data_path):
        self.data = json.loads(json_data)
        self.layers_list = set()
        self.program = Template("""import keras
from keras.models import Sequential
import keras.losses
from keras.layers import $layers_list
from keras import backend as K
import numpy as np
import argparse

$parse_args

def run_model(data_path, batch_size, epochs):
$data_processing

$model_creation
$model_compilation

$model_fitting

run_model(data_path, batch_size, epochs)
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
        load_csv = """dataset = np.loadtxt(data_path, delimiter=\",\")
x_data = dataset[:, :-1]
y_data = dataset[:, -1]"""
        return textwrap.indent(load_csv, "    ")
    
    def model_fitting(self):
        return textwrap.indent("history=model.fit(x_data, y_data, batch_size=batch_size, nb_epoch=epochs, validation_split = 0.2, verbose=1)", "    ")
    
    def parse_args(self):
        return """
parser = argparse.ArgumentParser(description="Training script")
parser.add_argument("--batch_size", default=128, type=int)
parser.add_argument("--num_classes", default=10, type=int)
parser.add_argument("--epochs", default=12, type=int)
parser.add_argument("--data", type=str, required=True)

args = parser.parse_args()

batch_size, num_classes, epochs, data_path =
  (args.batch_size, args.num_classes, args.epochs, args.data)
"""

    def generate(self):
        model = self.model_creation()
        return self.program.substitute(
            layers_list=", ".join(self.layers_list), data_processing=self.load_csv(), model_creation=model, 
            model_compilation=self.model_compilation(), model_fitting=self.model_fitting()
        )
